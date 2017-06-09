const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Stock = mongoose.model('Stock');

const getStocks = Stock.find({}, { _id: 0}, (err, stocks) => {
  if(err) reject(err);
  return (stocks);
});

const getStockSymbols = Stock.find( {}, { symbol: 1 , _id: 0 }, (err, symbols) => {
  if(err) reject(err);
  return (symbols);
});

const getCount = Stock.count({}, (err, count) => {
  if(err) reject(err);
  return(count);
});

const insertOne = (dataPoint) => {
  Stock.collection.save(dataPoint, (err) => {
    if(err)
      next(err);
  });
};

const bulkInsert = (dataPoints) => {
  Stock.collection.insert(dataPoints, (err) => {
    if(err)
      next(err);
    console.log("Bulk Insert Done!");
  });
};

const bulkUpsert = (dataPoints) => {
  const bulk = Stock.collection.initializeUnorderedBulkOp();
  dataPoints.map((dataPoint) => {
    bulk.find( {symbol: dataPoint.symbol} ).upsert().replaceOne(dataPoint);
  });
  bulk.execute();
  console.log("Bulk Update done !");
};

module.exports =  {
  getStocks,
  getStockSymbols,
  getCount,
  insertOne,
  bulkInsert,
  bulkUpsert
}
