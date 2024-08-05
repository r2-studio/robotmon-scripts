# ensure it's production version
IS_PRODUCTION=$(grep "exports.isProduction = true" ./index.js)
if [ -z "$IS_PRODUCTION" ]; then
    echo "Please set production version"
    exit 1
fi

zip index.zip ./index.js ./index.html
echo "com.r2studio.MLB9InningsBasic done"

# adb push ./index.js ./index.html storage/emulated/0/Download/Robotmon/scripts/com.r2studio.MLB9InningsBasic/