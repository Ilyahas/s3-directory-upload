'use strict';

const LIMIT_CONCURRENT_FILES = 5;

const async = require('async');
const fs = require('fs');
const path = require('path');

const s3 = require('./s3');
const show = require('./output');

const _walkFilesSync = (dir, filelist) => {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  const resolveDir = path.resolve(dir);
  files.forEach((file) => {
    try {
      const str = `${dir}/${file}`;
      if (fs.statSync(str.toString()).isDirectory()) {
        filelist = _walkFilesSync(`${dir}/${file}`, filelist);
      }
      else {
        filelist.push(`${dir}/${file}`);
      }
    } catch (error) {
      const errorMsg = `Cannot read directory ${resolveDir}/${file} or doesn't exist`;
      show.error(error, false);
    }
  });
  return filelist;
};

module.exports = async(directoryPath, credentials, deleteFilesInBucket) => {
  s3.init(credentials);
  show.info(`[fs] Reading directory...`);
  const directoryPathResolve = path.resolve(directoryPath);
  show.info(`[config] Directory to upload:\n\t ${directoryPathResolve}`);

  show.info(`[fs] Reading directory...`);
  let fileList = _walkFilesSync(directoryPath);
  show.info(`[fs] Got ${fileList.length} files to upload\n`);

  let clearBucket = deleteFilesInBucket || false;

  if(clearBucket) {
      await s3.clearBucket(process.env.BUCKET_NAME).then(clean => {
          if (fileList.length && clean) {
              async.mapLimit(fileList, LIMIT_CONCURRENT_FILES, s3.uploadFile(directoryPath), (err, filesUploaded) => {
                  if (err) {
                      return show.error(err, true);
                  }
                  show.progress('> All files uploaded successfully!', true);
                  show.info(`\n[result] URLs of uploaded files\n${filesUploaded.join('\n')}`);
              });
          }
      });
  } else {
      async.mapLimit(fileList, LIMIT_CONCURRENT_FILES, s3.uploadFile(directoryPath), (err, filesUploaded) => {
          if (err) {
              return show.error(err, true);
          }
          show.progress('> All files uploaded successfully!', true);
          show.info(`\n[result] URLs of uploaded files\n${filesUploaded.join('\n')}`);
      });
  }

};
