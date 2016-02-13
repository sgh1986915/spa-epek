#!/bin/bash

COMPILED_JS_PATH="js\/main-compiled-compressed.js"

rm -rf ./build
mkdir -p build

cp -R ./app/* ./build

cd ./build/js/ 

echo "Compiling js..."

/usr/local/bin/r.js -o ./build_config.js

echo "Uglify2 main-compiled.js --> main-compiled-compressed.js"
/usr/local/bin/uglifyjs main-compiled.js > main-compiled-compressed.js

echo Gzipping file for faster servitude

gzip -9 main-compiled-compressed.js
mv main-compiled-compressed.js.gz main-compiled-compressed.js

echo "Replacing path to main.js"

cd ..
sed -i "s/data-main=\"js\/main.js\"/data-main=\"$COMPILED_JS_PATH\"/g" ./index.html
