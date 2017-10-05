var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Stock = require('./crudStock'),
  MongoOplog = require('mongo-oplog');

io.on('connection', socket => {

  const oplog = MongoOplog('mongodb://127.0.0.1:27017/local',
                  { ns: 'stoker-development.stocks' })

  oplog.tail().then(async () => {
    console.log('oplog: tailing');
    let stocks = await Stock.getStocks();
    socket.emit('stocks', { stocks: stocks });
  }).catch(err => console.error(err))

  oplog.on('update', async (doc) => {
    console.log("oplog: Update");
    let stocks = await Stock.getStocks();
    socket.emit('stocks', { stocks: stocks });
  });

  oplog.on('insert',async (doc) => {
    console.log("oplog: Insert");
    let stocks = await Stock.getStocks();
    socket.emit('stocks', { stocks: stocks });
  });

  oplog.on('delete', async (doc) => {
    console.log("oplog: Delete");
    let stocks = await Stock.getStocks();
    socket.emit('stocks', { stocks: stocks });
  });
});
