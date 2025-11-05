#!/usr/bin/env bash

rm -rf ./dist 2>/dev/null
mkdir ./dist

# shellcheck disable=SC2155
export BUILD_DATE="$(date "+%F %H:%M:%S %:z")" # used by envsubst later
echo "Build date = $BUILD_DATE"

npx html-inline-external --src ./src/index.html --dest ./dist/index.inlined.html
envsubst \$BUILD_DATE < ./dist/index.inlined.html > ./dist/index.html
rm ./dist/index.inlined.html
cp ./src/index.js ./dist/

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
  adb $EXTRA_ARG push dist/index.js sdcard/Download/Robotmon/scripts/com.r2studio.TsumBeta/
  adb $EXTRA_ARG push dist/index.html sdcard/Download/Robotmon/scripts/com.r2studio.TsumBeta/
fi
