var express = require('express');
var app = express();
var port = 4711;

app.listen(port, function() {
  console.log('Express server listening on port %d in %s mode',
    port, app.settings.env);
});

app.get('/', function(req, res) {
  res.type('text/plain');
  res.send('i am a beautiful butterfly');
});