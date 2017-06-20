var express = require('express'),
  crawler = require('../helpers/crawler'),
  Stock = require('../helpers/stockCRUD'),
  StockLog = require('../helpers/stockLogCRUD'),
  mongoose = require('mongoose'),
  stockList = require('../helpers/stockList'),
  schedule = require('node-schedule'),
  time = require('time');

  time.tzset("Asia/Calcutta");
  Date = time.Date;

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
  }).catch(function (err) {
     console.log("Promise Rejected: " + err);
  });
};

module.exports = async function () {

  // Initialize on startup
  let dataSet = await Stock.getCount();
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
};
