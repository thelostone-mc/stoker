var express = require('express'),
  crawler = require('../helpers/crawler'),
  Stock = require('../helpers/stockCRUD'),
  mongoose = require('mongoose'),
  StockLog = mongoose.model('StockLog'),
  stockList = require('../helpers/stockList'),
  schedule = require('node-schedule');

/**
 * Invokes crawler for every stockSymbol and
 * does a single bulk insert upon completion
 */
const fetchDataPoints = (stocks) => {

  if(stocks == undefined) {
    console.log("Fetching symbols from stockList");
    stocks = stockList.stocks;
  }

  let init = [];

  stocks.map((stockSymbol) => {
    init.push(crawler.fetchIV(stockSymbol));
  });

  Promise.all(init).then(dataPoints => {
    Stock.bulkUpsert(dataPoints);
  }).catch(function (err) {
     console.log("Promise Rejected: " + err);
  });
};

module.exports = function () {

  // Initialize on startup
  Stock.getCount.then((dataSet) => {
    if(dataSet == 0) {
      console.log("Setting up data");
      fetchDataPoints();
    }
  });

  schedule.scheduleJob('0 * * * *', () => {
    fetchDataPoints();
  });
};
