# ensure it's production version
(grep "exports.isProduction = true" ./index.js) || (echo "error not build bc is not production version" & exit 1)

zip index.zip ./index.js ./index.html
echo "com.r2studio.MLB9InningsBasic done"

# adb push ./index.js ./index.html storage/emulated/0/Download/Robotmon/scripts/com.r2studio.MLB9InningsBasic/