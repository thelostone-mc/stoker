var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Stock = require('../helpers/stockCRUD'),
  MongoOplog = require('mongo-oplog');

module.exports = function (app) {
  app.use('/', router);

  io.on('connection', function (socket) {

    const oplog = MongoOplog('mongodb://127.0.0.1:27017/local',
                    { ns: 'stoker-development.stocks' })

    oplog.tail().then(() => {
      console.log('oplog: tailing')
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
};

router.get('/show', async function (req, res, next) {
  let stocks = await Stock.getStocks();
  res.render('showStocks', {
    stocks: stocks
  });
});

router.get('/stokcards', async function (req, res, next) {
  res.render('card');
});
