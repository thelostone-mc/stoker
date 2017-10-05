const express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Stock = require('../modules/crudStock');

module.exports = app => {
  app.use('/', router);

  router.get('/stocks/list', async (req, res, next) => {
    let stocks = await Stock.getStocks();
    res.json(stocks);
  });
}
