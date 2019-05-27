#!/bin/bash
set -ex
from_dir=scripts/com.r2studio.Tsum/tsums_16
to_dir=/sdcard/Robotmon/scripts/com.twpda.Tsum/tsums_16
adb shell "rm -rf $to_dir"
adb shell "mkdir -p $to_dir"
cd "$from_dir"
adb push *.png "$to_dir"
echo Done
# vim:et sw=2 ts=2 ai nocp sta

