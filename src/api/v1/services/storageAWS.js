const AWS = require('aws-sdk');
const fs = require('fs');

const ACCESS_KEY_ID = require('../../../config/index').S3_ID;
const SECRET_KEY = require('../../../config/index').S3_SECRET;
const BUCKET_NAME = require('../../../config/index').BUCKET_NAME;


const s3 = new AWS.S3({
    accessKeyId:ACCESS_KEY_ID,
    secretAccessKey:SECRET_KEY
});


exports.uploadFile = function (file){
        const params = {
            Bucket: 'bookdata001', 
            Key: file.name+".pdf", 
            Body: file.data
        };
       return s3.upload(params).promise();
};
