const stockList = require('./stockList'),
      crawler = require('./crawler'),
      Stock = require('./stockCRUD');

const intitalizeDump = () => {
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
}

module.exports.intitalizeDump = intitalizeDump;
