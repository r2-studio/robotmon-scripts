#!/bin/bash
rm -r ./dist

echo "var window = window || {};\n" > ./index.js
webpack --entry ./index.ts
cat ./dist/index.js >> ./index.js
echo "\nvar start = window.start\nvar stop = window.stop\n" >> ./index.js
cp ./index.js ./dist/index.js
rm ./index.js
echo "TsumTsum done"