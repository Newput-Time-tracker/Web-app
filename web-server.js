var express = require('express');
var app = express();

app.use(express.static(__dirname + '/build'));

app.get('/', function(req, res) {

  res.sendFile('index.html', {
    root : __dirname + '/build'
  });
});

var server = app.listen(80, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(__dirname);
  console.log('Example app listening at http://%s:%s', host, port);
});
