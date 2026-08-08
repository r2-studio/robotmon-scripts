# Builds Tsum and copies dist\* into the MuMu shared folder so the emulator
# can pick the script up from Robotmon's scripts directory.

$ErrorActionPreference = "Stop"

$ScriptDir = $PSScriptRoot
$DistDir = Join-Path $ScriptDir "dist"
$TargetDir = Join-Path $env:USERPROFILE "OneDrive\Documents\MuMuSharedFolder\Download\Robotmon\scripts\com.r2studio.Tsum"

# build.ps1 uses relative paths, so run it from its own directory
Push-Location $ScriptDir
try {
    Write-Host "Running build.ps1..."
    & (Join-Path $ScriptDir "build.ps1")
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Build failed (exit $LASTEXITCODE). Nothing was copied."
        exit $LASTEXITCODE
    }
} finally {
    Pop-Location
}

if (-not (Test-Path $DistDir)) {
    Write-Host "Build produced no dist directory at $DistDir."
    exit 1
}

Write-Host "Copying dist contents to $TargetDir..."
New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
Copy-Item -Path (Join-Path $DistDir "*") -Destination $TargetDir -Recurse -Force

Get-ChildItem -Path $TargetDir -File | ForEach-Object {
    Write-Host "  $($_.Name)  ($($_.Length) bytes)"
}
Write-Host "Deploy complete."
