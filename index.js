const express = require('express');
const app = express();

const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');


//configre keys for accessing AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

//configure AWS to work with promises
AWS.config.setPromisesDependency(bluebird);


//create s3 instance
const s3 = new AWS.S3();

app.listen(process.env.PORT || 8888);
console.log('server is up and running');