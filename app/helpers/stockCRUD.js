const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Stock = mongoose.model('Stock');

const bulkInsert = (dataPoints) => {
  Stock.collection.insert(dataPoints, (err) => {
    if(err)
      next(err);
    console.log("Bulk Insert Done!");
  });
};

const insertOne = (dataPoint) => {
  Stock.collection.save(dataPoint, (err) => {
    if(err)
      next(err);
  });
};

const getCount = new Promise((resolve, reject) => {
  Stock.count({}, (err, count) => {
    if(err) reject(err);
    resolve(count);
  });
});

const getStockSymbols = new Promise((resolve, reject) => {
  Stock.find({}, { symbol: 1 , _id: 0 }, (err, symbols) => {
    if(err) reject(err);
    resolve(symbols);
  });
});

const bulkUpdate = (dataPoints) => {
  const bulk = Stock.collection.initializeUnorderedBulkOp();
  dataPoints.map((dataPoint) => {
    bulk.find( {symbol: dataPoint.symbol} ).upsert().replaceOne(dataPoint);
  });
  bulk.execute();
  console.log("Bulk Update done !");
};

const getStocks = new Promise((resolve, reject) => {
  Stock.find({}, { _id: 0}, (err, stocks) => {
    if(err) reject(err);
    resolve(stocks);
  });
});

module.exports =  {
  bulkInsert,
  insertOne,
  getCount,
  getStockSymbols,
  bulkUpdate,
  getStocks
}
