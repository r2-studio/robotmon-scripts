#!/bin/bash
set -ex
basedir=scripts/com.twpda.Tsum
for f in index.js settings.js; do
  node_modules/.bin/eslint --fix "$basedir/$f"
#sed -n '/<script>/,/<\/script>/p' "$f" | sed -e '1 d' | sed -e '$ d' > tmp.js
#node_modules/.bin/eslint --fix tmp.js
done
echo Done
# vim:et sw=2 ts=2 ai nocp sta

