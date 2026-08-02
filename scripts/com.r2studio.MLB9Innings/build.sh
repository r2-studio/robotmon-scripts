#!/bin/bash
set -e

SCRIPT_ID="com.r2studio.MLB9Innings"

grep -q "package: \"${SCRIPT_ID}\"" index.html || {
  echo "Error: index.html is not premium edition (expected package: ${SCRIPT_ID})"
  exit 1
}

grep -q 'isLocalPaid: true' index.html || {
  echo "Error: index.html missing isLocalPaid: true (premium edition)"
  exit 1
}

if grep -q 'exports.isProduction = true' index.js; then
  echo "Building premium PRODUCTION script"
else
  echo "Building premium TEST script"
fi

rm -f index.zip
zip index.zip ./index.js ./index.html
echo "${SCRIPT_ID} done"

# adb push ./index.js ./index.html /storage/emulated/0/Download/Robotmon/scripts/com.r2studio.MLB9Innings/
