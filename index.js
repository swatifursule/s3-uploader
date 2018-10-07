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


// abstract function to upload a file returning a promise
const uploadFile = (buffer, name, type) =>{
    const params = {
        ACL: 'public-read',
        Body: buffer,
        Bucket: process.env.TEST_S3_BUCKET,
        ContentType: type.mime,
        Key: `${name}.${type.ext}`
    };
    return s3.upload(params).promise();
}


// Define POST route
app.post('/upload-file', (request, response) => {
    const form = new multiparty.Form();
    form.parse(request, async(error, fields, files) =>{
        if (error){
            throw new Error(error);
        }
        try{
            const path = files.file[0].path;
            const buffer = fs.readFileSync(path);
            const type = fileType(buffer);
            const timestamp = Date.now().toString();
            const fileName = `test-uploads/${timestamp}-lg`;
            const data = await uploadFile(buffer, fileName, type);
	    console.log("data after sending " +data);
            return response.status(200).send(data);
        }catch(err){
            return response.status(400).send(err);
        }
    });
});



app.listen(process.env.PORT || 8888);
console.log('server is up and running');
