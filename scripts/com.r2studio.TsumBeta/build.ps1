$files = 'index.html', 'index.js'
foreach ($file in $files)
{
    adb push $file sdcard/Download/Robotmon/scripts/com.r2studio.TsumBeta/$file
}
echo "Copied all files to remote adb device."
