'use strict';


const directory = process.argv.slice(2)[0];
const uploadDirectory = require('../');

if (!directory) {
  console.log(`[warn] You need to specify a directory to upload site from. For example: node index.js ../dir`);
  process.exit(1);
} else {
  uploadDirectory(directory);
}