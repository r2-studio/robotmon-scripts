cd ../../../libs/framework
sh build.sh

cd -

cp ../../../libs/framework.js .

cat framework.js > tmp.js
echo "\n" >> tmp.js
cat index.js >> tmp.js