# s3 directory upload

Script to upload directory to a S3 bucket by using official Amazon SDK.

## AWS Credentials

In order to use this module, you'll need to have AWS Credentials. You can load them, two ways:

* By passing directly to the method as second parameter.
* By having a .env file with the credentials.
  The ENV variables are `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY` and `BUCKET_NAME`.

## Install

```bash
npm install s3-directory-upload -S
```

In case you want to use the CLI, you can install it globally:

```bash
npm install -g s3-directory-upload
```

## Require
```javascript
const upload = require('s3-directory-upload')
// ES6: import s3UploadDirectory from 's3-directory-upload'

const directoryName = 'static'

const credentials = {
  "accessKeyId": "<Your Access Key Id>",
  "secretAccessKey": "<Your Secret Access Key>",
  "bucketName": "<Your Bucket Name>"
}
const deleteFilesInBucket = true; // default false

upload(directoryName, credentials, deleteFilesInBucket)
```

## CLI
```bash
s3-directory-upload <directory>

Example:
s3-directory-upload static
```

For the AWS Credentials you need a ENV variables called `ACCESS_KEY_ID`, `SECRET_ACCESS_KEY` and `BUCKET_NAME` in .env file.