$files = 'index.html', 'index.js', 'settings.js'
$dt = Get-Date -Format "yyyy-MM-dd HH:mm:ss K"
New-Item -ItemType Directory -Force .\dist
foreach ($file in $files)
{
    Get-Content -Raw $file | ForEach-Object {$_ -Replace '\$BUILD_DATE', $dt} | Set-Content -Path .\dist\$file
    adb push dist\$file sdcard/Download/Robotmon/scripts/com.r2studio.TsumBeta/$file
}
Write-Output "Copied all files to remote adb device."

Compress-Archive -Update -Path .\dist\* -DestinationPath index.zip
Write-Output "Created distributable zip archive."
