files=( index.js index.html settings.js )

rm -rf dist 2>/dev/null
mkdir dist

# shellcheck disable=SC2155
export BUILD_DATE="$(date "+%F %H:%M:%S %:z")" # used by envsubst later

for file in "${files[@]}"; do
  envsubst \$BUILD_DATE < "$file" > dist/"$file"
done

(
cd dist || exit
zip ../index.zip -- *
)

#adb push index.zip sdcard/Robotmon/scripts/com.r2studio.TsumBeta/index.zip
