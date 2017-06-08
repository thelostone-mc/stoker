
var express = require('express'),
  app = express();
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  server = require('http').Server(app),
  io = require('socket.io')(server);

mongoose.connect(config.db);
mongoose.Promise = Promise;

var db = mongoose.connection;

db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

module.exports = require('./config/express')(app, config);

server.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});
