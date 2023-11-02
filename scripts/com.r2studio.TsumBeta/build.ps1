$files = 'index.html', 'index.js', 'settings.js'
foreach ($file in $files)
{
    adb push $file sdcard/Download/Robotmon/scripts/com.r2studio.TsumBeta/$file
}
echo "Copied all files to remote adb device."
