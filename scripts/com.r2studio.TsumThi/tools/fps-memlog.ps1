# Samples memory and frame stats from the emulator and host into a CSV so the
# process whose footprint climbs alongside the FPS drop can be identified:
#   - robotmon service (script runtime, screenshots, input injection)
#   - Tsum Tsum game app (PSS + native heap, frame jank since last sample)
#   - Android system free RAM
#   - MuMu host processes (Windows working set)
#
# Usage (from the repo, with the emulator running):
#   powershell -ExecutionPolicy Bypass -File tools\fps-memlog.ps1
#   Ctrl+C to stop. Then inspect tools\fps-memlog.csv (Excel or Import-Csv).
#
# Reading the result after 1-2 hours: whichever *_pss/_native/_ws column rises
# steadily while FPS sinks is the culprit. If nothing rises, the drop is not
# memory pressure - look at CPU/thermal or MuMu's renderer instead.

param(
    [string]$Device = "127.0.0.1:16384",
    [int]$IntervalSec = 300,
    [string]$OutFile = "$PSScriptRoot\fps-memlog.csv"
)

function Get-PkgMem([string]$pkg) {
    $out = adb -s $Device shell dumpsys meminfo $pkg 2>$null
    $r = @{ pss = ""; native = "" }
    if (-not $out) { return $r }
    $text = $out -join "`n"
    if ($text -match 'TOTAL PSS:\s+([\d,]+)') { $r.pss = $Matches[1] -replace ',', '' }
    elseif ($text -match '(?m)^\s*TOTAL\s+([\d,]+)') { $r.pss = $Matches[1] -replace ',', '' }
    if ($text -match '(?m)^\s*Native Heap\s+([\d,]+)') { $r.native = $Matches[1] -replace ',', '' }
    return $r
}

function Find-Pkg([string]$pattern) {
    $list = adb -s $Device shell pm list packages 2>$null
    foreach ($line in $list) {
        if ($line -match "package:(.*$pattern.*)") { return $Matches[1].Trim() }
    }
    return $null
}

$robotmonPkg = Find-Pkg 'robotmon'
$gamePkg = Find-Pkg 'LGTMTM'
Write-Host "robotmon: $robotmonPkg / game: $gamePkg / logging to $OutFile every $IntervalSec s"
if (-not $gamePkg) { Write-Host "WARNING: game package not found - is the emulator connected at $Device ?" }

# Reset gfxinfo so the first sample's jank% covers a known window.
if ($gamePkg) { adb -s $Device shell dumpsys gfxinfo $gamePkg reset | Out-Null }

while ($true) {
    $row = [ordered]@{ time = (Get-Date -Format "yyyy-MM-dd HH:mm:ss") }

    if ($robotmonPkg) {
        $m = Get-PkgMem $robotmonPkg
        $row.robotmon_pss_kb = $m.pss
        $row.robotmon_native_kb = $m.native
    }

    if ($gamePkg) {
        $m = Get-PkgMem $gamePkg
        $row.game_pss_kb = $m.pss
        $row.game_native_kb = $m.native

        # Frame stats accumulated since the previous reset = this interval only.
        $gfx = (adb -s $Device shell dumpsys gfxinfo $gamePkg 2>$null) -join "`n"
        $row.game_frames = if ($gfx -match 'Total frames rendered:\s+(\d+)') { $Matches[1] } else { "" }
        $row.game_janky_pct = if ($gfx -match 'Janky frames:\s+\d+ \(([\d.]+)%\)') { $Matches[1] } else { "" }
        adb -s $Device shell dumpsys gfxinfo $gamePkg reset | Out-Null
    }

    $sys = (adb -s $Device shell dumpsys meminfo 2>$null) -join "`n"
    $row.sys_free_ram_kb = if ($sys -match 'Free RAM:\s+([\d,]+)K') { $Matches[1] -replace ',', '' } else { "" }

    $mumu = Get-Process | Where-Object { $_.ProcessName -match 'MuMu' }
    $row.host_mumu_ws_mb = if ($mumu) { [math]::Round(($mumu | Measure-Object WorkingSet64 -Sum).Sum / 1MB) } else { "" }

    [PSCustomObject]$row | Export-Csv -Path $OutFile -Append -NoTypeInformation
    Write-Host ("{0}  robotmon={1}K  game={2}K (native {3}K)  janky={4}%  freeRAM={5}K  hostMuMu={6}MB" -f `
        $row.time, $row.robotmon_pss_kb, $row.game_pss_kb, $row.game_native_kb, $row.game_janky_pct, $row.sys_free_ram_kb, $row.host_mumu_ws_mb)

    Start-Sleep -Seconds $IntervalSec
}
