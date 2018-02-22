'use strict';

const path = require('path');

const POSITION_STRING_AVOID_DOT = 1;
const REGEX_HASH_QUERYSTRING = /[#\\?]/g;

const DEFAULT_CONTENT_TYPE = 'application/octet-stream';
const extensionContentTypeDictionary = {
  'css': 'text/css',
  'gif': 'image/gif',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpg',
  'jpg': 'image/jpg',
  'js': 'application/x-javascript',
  'json': 'application/json',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'txt': 'text/plain',
  'xml': 'application/xml'
};

const getFileExtension = (fileName) => {
  const extname = path.extname(fileName);
  const endOfExt = extname.search(REGEX_HASH_QUERYSTRING);
  return endOfExt > -1
    ? extname.substring(POSITION_STRING_AVOID_DOT, endOfExt)
    : extname.substring(POSITION_STRING_AVOID_DOT);
};

const getContentType = (ext) => {
  return extensionContentTypeDictionary[ext] || DEFAULT_CONTENT_TYPE;
};

module.exports = {
  getFileExtension,
  getContentType
};
