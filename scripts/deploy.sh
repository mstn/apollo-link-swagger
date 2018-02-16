#!/bin/bash

# cleanup lib directory
rm -rf lib || exit 0;
mkdir lib;

# compile to javascript
npm run compile

# build vanilla package.json
node -e "var package = require('./package.json'); \
  delete package.scripts; \
  delete package.options; \
  delete package.jest; \
  delete package.devDependencies; \
  package.main = 'index.js'; \
  package.typings = 'index.d.ts'; \
  var fs = require('fs'); \
  fs.writeFileSync('./lib/package.json', JSON.stringify(package, null, 2)); \
  "

# Copy to ./npm
cp README.md lib/
cp LICENSE lib/

# publish to npm
cd lib && npm publish --access public
