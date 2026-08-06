#!/bin/bash
set -e

SCRIPT_ID="com.r2studio.MLB9InningsBasic"

grep -q "package: \"${SCRIPT_ID}\"" index.html || {
  echo "Error: index.html is not basic edition (expected package: ${SCRIPT_ID})"
  exit 1
}

if grep -q 'isLocalPaid' index.html; then
  echo "Error: index.html must not contain isLocalPaid (basic/free edition)"
  exit 1
fi

if grep -q 'exports.isProduction = true' index.js; then
  echo "Building basic PRODUCTION script"
else
  echo "Building basic TEST script"
fi

rm -f index.zip
zip index.zip ./index.js ./index.html
echo "${SCRIPT_ID} done"

# adb push ./index.js ./index.html /storage/emulated/0/Download/Robotmon/scripts/com.r2studio.MLB9InningsBasic/
