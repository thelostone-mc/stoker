var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Stock = require('../helpers/stockCRUD');

module.exports = function (app) {
  app.use('/', router);

  io.on('connection', async function (socket) {
    let stocks = await Stock.getStocks();
    socket.emit('stocks', { stocks: stocks });
  });
};

router.get('/show', async function (req, res, next) {
  let stocks = await Stock.getStocks();
  res.render('showStocks', {
    stocks: stocks
  });
});
