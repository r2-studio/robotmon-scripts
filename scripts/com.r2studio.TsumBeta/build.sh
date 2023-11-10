#!/usr/bin/env sh

rm -rf ./dist 2>/dev/null
mkdir ./dist

# shellcheck disable=SC2155
export BUILD_DATE="$(date "+%F %H:%M:%S %:z")" # used by envsubst later

npx html-inline-external --src ./src/index.html --dest ./dist/index.inlined.html
envsubst \$BUILD_DATE < ./dist/index.inlined.html > ./dist/index.html
rm ./dist/index.inlined.html
cp ./src/index.js ./dist/

(
cd dist || exit
zip ../index.zip -- *
)

#adb push index.zip sdcard/Robotmon/scripts/com.r2studio.TsumBeta/index.zip
