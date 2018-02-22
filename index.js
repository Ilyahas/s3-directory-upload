'use strict';

require('dotenv').config();
const path = require('path');
const show = require('./lib/output');
const uploadDirectory = require('./lib/upload-directory');

const DEFAULT_DIRECTORY_NAME = 'static';

module.exports = function (directoryToUpload, credentials, deleteFilesInBucket) {
  directoryToUpload = directoryToUpload || DEFAULT_DIRECTORY_NAME;
  const directoryPath = path.resolve(directoryToUpload);
  show.info(`[config] Directory to upload:\n\t ${directoryPath}`);
  uploadDirectory(directoryPath, credentials, deleteFilesInBucket);
};
