#!/bin/bash
set -ex
node_modules/.bin/eslint --fix scripts/com.r2studio.Tsum/index.js
f=scripts/com.r2studio.Tsum/index.html
sed -n '/<script>/,/<\/script>/p' "$f" | sed -e '1 d' | sed -e '$ d' > tmp.js
node_modules/.bin/eslint --fix tmp.js
echo Done
# vim:et sw=2 ts=2 ai nocp sta

