var fs = require('fs');
var https = require('https');
 
var blob_host = 'robeich.blob.core.windows.net';
var blob_container = 'uploads';
// Use any tool to generate a Shared Access Key e.g. Azure Management Studio
var blob_sas = '?sr=c&sv=2014-02-14&si=tessel&sig=xxxxRv%2xxxxUTd8xxxxMKc0xxxxi%2Fxxxxw6VsxxxxGjdJxxxx';
 
var blob_name = 'test.jpg';
 
// Upload a file to Blob Storage
 
var file_data = fs.readFileSync('test.jpg');
 
var options = {
  hostname: blob_host,
  port: 443,
  path: '/' + blob_container + '/' + blob_name + blob_sas,
  method: 'PUT',
  headers: {
  	'Content-Length' : file_data.length,
  	'x-ms-blob-type' : ' BlockBlob',
  	'Content-Type' : 'image/jpeg'
  }
};
 
var req = https.request(options, function(res) {
  console.log("statusCode: ", res.statusCode);
  console.log("headers: ", res.headers);
 
  res.on('data', function(d) {
    process.stdout.write(d);
  });
});
 
req.on('error', function(e) {
  console.error(e);
});
 
req.write(file_data);
 
req.end();
