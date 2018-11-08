#!/usr/bin/env bash

node ./node_modules/nodemon/bin/nodemon.js --watch server --exec ./node_modules/babel-cli/bin/babel-node.js ./server/index.js  --ignore src
