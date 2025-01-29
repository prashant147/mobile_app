// aws-config.js
import AWS from 'aws-sdk';

AWS.config.update({
    region: 'us-west-1',
    accessKeyId: ' AKIAZQ3DTOGR4F2S7IFD',
    secretAccessKey: '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',
  
  });

const s3 = new AWS.S3();

export default s3;