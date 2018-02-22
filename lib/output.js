'use strict';

const FRAMES = ['-', '\\', '|', '/'];
let loadingPosition = 0;

const logUpdate = require('log-update');

const error = (err, forceExit) => {
  console.error(err);
  if (forceExit) {
    process.exit(0);
  }
};

const progress = (msg, clean) => {
  const frame = clean ? '' : FRAMES[loadingPosition++ % FRAMES.length];
  logUpdate(`${frame} ${msg}`);
};

const info = (msg) => {
  console.log(msg);
};

const success = (msg) => {
  console.log(msg || '');
  process.exit(0);
};

module.exports = {
  error,
  info,
  progress,
  success
};
