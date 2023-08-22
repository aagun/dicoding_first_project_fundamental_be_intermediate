const AWS = require("aws-sdk");
const config = require("../utils/config");

class StorageServices {
  constructor() {
    this._S3 = new AWS.S3();
  }

  writeFile(file, meta) {
    const params = {
      Bucket: config.s3.bucketName,
      Key: +new Date() + meta.filename,
      Body: file._data,
      ContentType: meta.headers["content-type"],
    };

    return this._S3.upload(params).promise();
  }
}

module.exports = StorageServices;
