## s3-pgp-encryptor
PGP encrypts files added to an S3 bucket

### Deployment Instructions 
* When you click 'Deploy', you must enter values for the following 2 parameters:
  * ##### bucketname 
    Name of the S3 bucket where you will upload files you wish to encrypt (must NOT already exist).
  * ##### base64encodedpublickey
    Base64 encode your PGP public key.  If you're not sure how to do that, go to https://www.base64encode.org/ 
### Use
* Upload any file to the S3 bucket you specified above and the file will be encrypted using your PGP public key.
* Problems? Email lamb.dan@gmail.com 

### License
&copy; 2018 [Dan Lamb](https://github.com/bmalnad). This project is available under the terms of the MIT license.