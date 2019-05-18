#!/bin/bash
set -ex
t=/sdcard/Robotmon/scripts/com.twpda.Tsum
f=scripts/com.r2studio.Tsum/index.html
adb push "$f" "$t"
f=scripts/com.r2studio.Tsum/index.js
adb push "$f" "$t"
echo Done
# vim:et sw=2 ts=2 ai nocp sta

