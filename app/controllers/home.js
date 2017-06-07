var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Stock = require('../helpers/stockCRUD');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/show', function (req, res, next) {
  Stock.getStocks.then((stocks) => {
    res.send(stocks);
  });
});
