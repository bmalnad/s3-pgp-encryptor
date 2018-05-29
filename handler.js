'use strict';
const AWS = require('aws-sdk');
const openpgp = require('openpgp');
openpgp.config.show_version = false;
openpgp.config.show_comment = false;

module.exports.encrypt = (event, context, callback) => {

  if(!event.Records[0].s3.object.key.endsWith('.pgp')){
    const s3 = new AWS.S3();
    const s3bucket = event.Records[0].s3.bucket.name;
    const s3key = event.Records[0].s3.object.key.replace(/\+/g,' ').replace(/%2B/g, '+');  //s3 doesn't play nicely with 

    s3.getObject({
      'Bucket': s3bucket,
      'Key': s3key,
    }, function(err, data){
      let fileBuffer = Buffer.from(data.Body);
      openpgp.initWorker({}); // initialise openpgpjs
      const openpgpPublicKey = openpgp.key.readArmored(Buffer.from(process.env.BASE64ENCODEDPUBLICKEY, 'base64').toString('ascii').trim());
      const fileForOpenpgpjs = new Uint8Array(fileBuffer);
      const options = {
        data: fileForOpenpgpjs,
        publicKeys: openpgpPublicKey.keys,
        armor: false
      };
      openpgp.encrypt(options).then(function(cipherText) {
        let encrypted = cipherText.message.packets.write();
        let s3params = {
          Body: Buffer.from(encrypted),
          Bucket: s3bucket,
          Key: s3key + '.pgp',
        };
        s3.putObject(s3params, function(err){
          if(err){
            // eslint-disable-next-line                
            console.log(err, err.stack);
          }else{
            //successfully encrypted file, delete unencrypted original
            let deleteParams = {
              Bucket: s3bucket,
              Key: s3key,
            };
            s3.deleteObject(deleteParams, function(err, data){
              if(err){
                // eslint-disable-next-line                
                console.log(err, err.stack);
              }else{
                // eslint-disable-next-line                
                console.log('Replaced ' + s3key + ' with ' + s3key + '.pgp');
              }
            });
          }
        });
      });
    });
  }
};
