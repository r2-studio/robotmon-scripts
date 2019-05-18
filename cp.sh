#!/bin/bash
set -ex
from_dir=scripts/com.r2studio.Tsum
to_dir=/sdcard/Robotmon/scripts/com.twpda.Tsum
cd "$from_dir"
adb push index.html index.js settings.js "$to_dir"
echo Done
# vim:et sw=2 ts=2 ai nocp sta

