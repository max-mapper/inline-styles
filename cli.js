#!/usr/bin/env node

var fs = require('fs')
var inliner = require('./')
var inlined = inliner(fs.readFileSync(process.argv[2])).toString()
console.log(inlined)