#!/usr/bin/env bash

rm -rf ./dist ./build 2>/dev/null
mkdir ./dist ./build

# Compile the game script (split files bundled via outFile -> ./build/index.js)
echo "Compiling TypeScript (game bundle)..."
npx tsc

# Compile the settings UI script separately -> ./build/settings.js
echo "Compiling TypeScript (settings UI)..."
npx tsc -p tsconfig.settings.json

# Stage the static assets next to the compiled JS so html-inline-external can
# resolve `<script src="settings.js">` and `<link href="index.css">` references.
cp ./src/index.html ./build/
cp ./src/index.css ./build/

# shellcheck disable=SC2155
export BUILD_DATE="$(date "+%F %H:%M:%S %:z")" # used by envsubst later
echo "Build date = $BUILD_DATE"

npx html-inline-external --src ./build/index.html --dest ./dist/index.inlined.html
envsubst \$BUILD_DATE < ./dist/index.inlined.html > ./dist/index.html
rm ./dist/index.inlined.html
cp ./build/index.js ./dist/

(
cd dist || exit
zip ../index.zip -- *
)

while getopts ":ad:" opt; do
  case $opt in
    a) ADB="true"
    ;;
    d) DEVICE="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    exit 1
    ;;
  esac

  case $OPTARG in
    -*) echo "Option $opt needs a valid argument"
    exit 1
    ;;
  esac
done

if [[ -v ADB ]] && [[ $ADB = true ]]; then
  if [[ -v DEVICE ]]; then
    EXTRA_ARG="-s $DEVICE"
  fi
  adb $EXTRA_ARG push dist/index.js sdcard/Download/Robotmon/scripts/com.r2studio.Tsum/
  adb $EXTRA_ARG push dist/index.html sdcard/Download/Robotmon/scripts/com.r2studio.Tsum/
fi
