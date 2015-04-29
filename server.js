var express    = require('express'),
    mongoose   = require('mongoose'),
    bodyParser = require('body-parser'),
    fs         = require('fs');

var app = express();
var port = 4711;

// connect to db
mongoose.connect('mongodb://localhost:27017/items_database')

// schema
var Item = new mongoose.Schema({
  title: String,
  description: String,
  dealerInternalNotes: String,
  material: {
    description: String,
    restricted:  Boolean
  },
  measurement: {
    unit: String,
    shape: String
  },
  condition: {
    description: String
  }
});

// models
var ItemModel = mongoose.model('Item', Item);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
  next();
});

// get field values
app.get('/api/enums', function(req, res) {

  var content;

  fs.readFile('./enums.json', function read(err, data) {
      if (err) {
        return console.log(err);
      }
      content = JSON.parse(data);
      return res.send(content);
  });
});

// get all items
app.get('/api/items', function(req, res) {
  return ItemModel.find(function( err, items ) {
    if (!err) {
      return res.send(items);
    } else {
      return console.log(err);
    }
  });
});

// add an item
app.post('/api/items', function(req, res) {
  console.log(req.body);
  var item = new ItemModel({
    title: req.body.title,
    description: req.body.description,
    dealerInternalNotes: req.body.dealerInternalNotes,
    material: req.body.material,
    condition: req.body.condition,
    measurement: req.body.measurement
  });

  item.save(function(err) {
    if(!err) {
      return console.log('created');
    } else {
      return console.log(err);
    }
  });

  return res.send(item);
});

// get an item
app.get('/api/items/:id', function(req, res) {
  return ItemModel.findById(req.params.id, function(err, item) {
    if (!err) {
      return res.send(item);
    } else {
      return console.log(err);
    }
  });
});

// update
app.put('/api/items/:id', function(req, res) {
  return ItemModel.findById(req.params.id, function(err, item) {
    item.title = req.body.title;
    item.description = req.body.description;
    item.dealerInternalNotes = req.body.dealerInternalNotes;
    item.material = req.body.material;
    item.condition = req.body.condition;
    item.measurement = req.body.measurement;

    return item.save(function(err) {
      if(!err) {
        console.log('book updated');
      } else {
        console.log(err);
      }

      return res.send(item);
    });
  });
});

// delete
app.delete('/api/items/:id', function(req, res) {
  return ItemModel.findById(req.params.id, function(err, item) {
    return item.remove(function(err) {
      if(!err) {
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});

app.listen(port, function() {
  console.log('Express server listening on port %d in %s mode',
    port, app.settings.env);
});