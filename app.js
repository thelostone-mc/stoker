
const express = require('express'),
  app = express();
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  server = require('http').Server(app),
  io = require('socket.io')(server);

mongoose.connect(config.db, { useMongoClient: true });
mongoose.Promise = Promise;

var db = mongoose.connection;

db.on('error', () => {
  throw new Error('unable to connect to database at ' + config.db);
});

const models = glob.sync(config.root + '/app/models/**/*.js');
models.forEach(model => {
  require(model);
});

module.exports = require('./config/express')(app, config);

server.listen(config.port, () => {
  console.log('Express server listening on port ' + config.port);
});
