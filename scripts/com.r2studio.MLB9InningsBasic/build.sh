#!/bin/bash
rm -r ./dist
rm ./index.js

echo "var window = window || {};\n" >> ./index.js
webpack --entry ./index.ts && rbm run --file=dist/index.js
cat ./dist/index.js >> ./index.js
echo "\nfunction start(jsonConfig){window.start(jsonConfig);}\nfunction stop(){window.stop();}\n" >> ./index.js
cp ./index.js ./dist/index.js
zip index.zip ./index.js ./index.html
rm ./index.js
echo "com.r2studio.MLB9InningsBasic done"

# adb push ./index.js ./index.html storage/emulated/0/Download/Robotmon/scripts/com.r2studio.MLB9InningsBasic/