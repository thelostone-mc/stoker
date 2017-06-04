var express = require('express'),
  crawler = require('../helpers/crawler'),
  Stock = require('../helpers/stockCRUD'),
  mongoose = require('mongoose'),
  StockLog = mongoose.model('StockLog'),
  stockList = require('../helpers/stockList');

/**
 * Invokes crawler for every stockSymbol and
 * does a single bulk insert upon completion
 */
const fetchDataPoints = () => {
  const stocks = stockList.stocks;
  let init = [];

  stocks.map((stockSymbol) => {
    init.push(crawler.fetchIV(stockSymbol));
  });

  Promise.all(init).then(dataPoints => {
    Stock.bulkInsert(dataPoints);
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
    console.log(dataSet);
  });
};
