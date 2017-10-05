const express = require('express'),
  mongoose = require('mongoose'),
  schedule = require('node-schedule'),
  promiseRetry = require('promise-retry'),
  crawler = require('./crawler'),
  Stock = require('./crudStock'),
  StockLog = require('./crudStockLog'),
  stockList = require('./list');
//   time = require('time');
//
// time.tzset("Asia/Calcutta");
// Date = time.Date;

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
    init.push(promiseRetry((retry, number) => {
      return crawler.fetchIV(stockSymbol).catch(retry);
    }));
  });

  Promise.all(init).then(dataPoints => {
    Stock.bulkUpsert(dataPoints);
  }).catch(err => {
     console.log("Promise Rejected: " + err);
  });
};

/**
 * Invokes crawler for every stockSymbol and
 * does a single bulk update upon completion
 */
const updateStockLog = async (stocks) => {

  if(stocks == undefined) {
    console.log("Fetching symbols from stockList for stockLog");
    stocks = stockList.stocks;
  }

  let init = [];

  stocks.map((stockSymbol) => {
    init.push(crawler.fetchIV(stockSymbol));
  });

  Promise.all(init).then(dataSets => {
    StockLog.bulkAppendDataToStock(dataSets);
  }).catch(err => {
     console.log("Promise Rejected: " + err);
  });
};

// Initialize on startup
Stock.getCount().then(dataSet => {

  if(dataSet == 0) {
    console.log("Setting up data");
    fetchDataPoints();
  }

  schedule.scheduleJob('0 * * * *', () => {
    fetchDataPoints();
  });

  schedule.scheduleJob('0 16 * * *', () => {
    updateStockLog();
  });
});
