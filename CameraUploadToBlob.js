var tessel = require('tessel');
var https = require('https');
 
// Upload parameters
 
var blob_host = 'robeich.blob.core.windows.net';
var blob_container = 'uploads';
// Use any tool to generate a Shared Access Key e.g. Azure Management Studio
var blob_sas = '?sr=c&sv=2014-02-14&si=tessel&sig=xxxxRv%2xxxxUTd8xxxxMKc0xxxxi%2Fxxxxw6VsxxxxGjdJxxxx';
 
/*
** Upload a picture to Azure
*/
 
function upload_picture(name, image)
{
  var options = {
    hostname: blob_host,
    port: 443,
    path: '/' + blob_container + '/' + name + blob_sas,
    method: 'PUT',
    headers: {
      'Content-Length' : image.length,
      'x-ms-blob-type' : 'BlockBlob',
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
 
  req.write(image);
 
  req.end();
 
  // Return full URL of the uploaded image
  return 'http://' + blob_host + '/' + blob_container + '/' + name;
}
 
// Set up the camera
 
var camera = require('camera-vc0706').use(tessel.port['B']);
 
camera.on('ready', function() {
  console.log('camera ready');
  // Take a picture
  camera.takePicture(function(err, image) {
    if (err) {
      console.log('error taking image', err);
    } else {
      // Name the image
      var name = 'picture-' + Math.floor(Date.now()*1000) + '.jpg';
      // Upload the image
      console.log('Uploading picture as', name, '...');
      var url = upload_picture(name, image);
      console.log(url);
      console.log('done.');
      // Turn the camera off to end the script
      camera.disable();
    }
  });
});
 
camera.on('error', function(err) {
  console.error(err);
});
