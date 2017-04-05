var http = require('http');
var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(__dirname + '/public'));
app.get('*', function (req, res) {
  res.sendFile(path.join( __dirname, 'prod.html' ));
});
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});	

var server = http.createServer( app )