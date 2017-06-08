var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Stock = require('../helpers/stockCRUD');

module.exports = function (app) {
  app.use('/', router);

  io.on('connection', function (socket) {
    Stock.getStocks.then((stocks) => {
      socket.emit('stocks', { stocks: stocks });
    });
  });
};

router.get('/show', function (req, res, next) {
  Stock.getStocks.then((stocks) => {
    res.render('showStocks', {
      stocks: stocks
    });
  });
});
