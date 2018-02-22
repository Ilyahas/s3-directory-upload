'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');

const show = require('./output');
const utils = require('./utils');

const FIELDS_FOR_CREDENTIALS = [ 'accessKeyId', 'secretAccessKey', 'bucketName'];

let awsConfig;
let s3;

const _checkConfigIsCorrect = (credentials) => {
  return Object
    .keys(credentials)
    .every(field => FIELDS_FOR_CREDENTIALS.indexOf(field) >= 0)
};

const init = (credentials) => {
  show.info('[s3] Initialize Amazon S3...');
  show.info('[config] Load config credentials and start AWS S3 Client');

  awsConfig = {accessKeyId: '', secretAccessKey: '', bucketName: ''};
  show.info('[config] Get from .env');
  if (credentials && _checkConfigIsCorrect(credentials)) {
    awsConfig.accessKeyId = credentials.accessKeyId;
    awsConfig.secretAccessKey = credentials.secretAccessKey;
    awsConfig.bucketName = credentials.bucketName;
  } else {
    try {
      awsConfig.accessKeyId = process.env.ACCESS_KEY_ID;
      awsConfig.secretAccessKey = process.env.SECRET_ACCESS_KEY;
      awsConfig.bucketName = process.env.BUCKET_NAME;
      show.info(`[config] Got awsConfig from .env`);
    } catch (ex) {
      show.error('[error] Impossible to set config. Are you sure to have a .env file with the path to the credentials?',
        true);
    }
  }
  AWS.config.update(awsConfig);
  s3 = new AWS.S3();
  show.info('[s3] Amazon S3 initialized');
};

const listBuckets = () => {
  s3.listBuckets({}, (err, data) => {
    const buckets = data.Buckets;
    const owners = data.Owner;
    for (let i = 0; i < buckets.length; ++i) {
      const bucket = buckets[i];
      show.info(`${bucket.Name} created on ${bucket.CreationDate}`);
    }
    for (let i = 0; i < owners.length; ++i) {
      show.info(`${owners[i].ID} ${owners[i].DisplayName}`);
    }
  });
};

const deleteBucket = () => {
  s3.deleteBucket({Bucket: awsConfig.bucketName}, (err, data) => {
    if (err) {
      show.error(`[s3] Error deleting bucket ${err}`, false);
    } else {
      show.info(`[s3] Delete the bucket ${data}`);
    }
  });
};

const clearBucket = () => {
  return s3.listObjects({Bucket: awsConfig.bucketName}).promise()
    .then(data => {
      if (!data.Contents.length) {
        return true;
      }
      let promises = data.Contents.map(item => {
        const deleteParams = {Bucket: awsConfig.bucketName, Key: item.Key};

        return s3.deleteObject(deleteParams).promise()
          .then(data => {
            show.info(`[s3] Deleted ${deleteParams.Key}`);
          }).catch(err => {
            show.error(`[s3] Delete err ${deleteParams.Key}: ${err}`, false);
          });
      });
      return Promise.all(promises);
    }).catch(err => {
      show.error(`[s3] Get objects err: ${err}`, false);
    });
};

const uploadFile = (rootDir) => {
  return (file, done) => {
    let fileWithoutLocalPath = file.slice(rootDir.length + 1, file.length);
    show.progress(`Uploading ${fileWithoutLocalPath}...`);

    fs.readFile(file, (err, data) => {
      if (err) {
        show.error(`[fs] ${err}`, true);
      }
      const fileExtension = utils.getFileExtension(file);
      const metaData = utils.getContentType(fileExtension);

      const params = {
        ACL: 'public-read',
        ContentType: metaData,
        Body: data,
        Bucket: awsConfig.bucketName,
        Key: fileWithoutLocalPath
      };
      const onUpload = (err, data) => {
        if (err) {
          done(err);
        }
        else {
          show.progress(`Uploaded ${fileWithoutLocalPath}...`);
        }
        done(null, data.Location);
      };

      s3.upload(params, onUpload);
    });
  }
};

module.exports = {
  init,
  clearBucket,
  deleteBucket,
  listBuckets,
  uploadFile
};
