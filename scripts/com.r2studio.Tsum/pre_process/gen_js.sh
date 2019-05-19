#!/bin/bash
[ $# -ne 1 ] && echo "Usage: gen_js.sh <origin_image>" && exit 1
i=0
for f in $(ls "$1"); do
  n=$(basename "$f" .png)
  if [[ $i -eq 0 ]]; then
    echo -e "  tsumFiles: ['$n'\c"
  else
    echo -e ", '$n'\c"
  fi
  i=$((i+1))
done
echo "],"
# vim:et sw=2 ts=2 ai nocp sta

