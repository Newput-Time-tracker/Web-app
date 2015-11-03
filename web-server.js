var express = require('express');
var app = express();

// serve static files on server

//for DEV envrionment
app.use(express.static(__dirname));
app.use('/vendors', express.static(__dirname + '/bower_components'));
app.use('/dev_css', express.static(__dirname + '/app/assets/styles'));
app.use('/dev_js', express.static(__dirname + '/app/assets/js'));
app.use('/scripts', express.static(__dirname + '/app/scripts'));

//for PROD environment
app.use('/fonts', express.static(__dirname + '/public/assets/styles/fonts'));
app.use('/css', express.static(__dirname + '/public/assets/styles'));
app.use('/js', express.static(__dirname + '/public/assets/js'));


// for all environment
app.use('/views', express.static(__dirname + '/app/views'));
app.use('/images', express.static(__dirname + '/app/assets/images'));

app.get('/', function(req, res) {
  res.sendFile('app/index.html', {
    root : __dirname
  });
});

app.get('/detailview/:date', function(req, res) {
  res.sendFile('app/index.html', {
    root : __dirname
  });
});

app.get('/usertimesheet', function(req, res) {
  res.sendFile('app/index.html', {
    root : __dirname
  });
});


var server = app.listen((process.env.PORT || 5000), function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(__dirname);
  console.log('Example app listening at http://%s:%s', host, port);
});

