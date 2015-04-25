var express = require('express'),
    fs = require('fs');

var app = express();
var port = 4711;

app.listen(port, function() {
  console.log('Express server listening on port %d in %s mode',
    port, app.settings.env);
});

app.get('/items', function(req, res) {

  var obj;
  fs.readFile('item.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);

    res.send(obj.message);
  });
});
