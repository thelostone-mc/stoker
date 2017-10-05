const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      StockLog = mongoose.model('StockLog');

const getStocksLog = () => {
  return new Promise((resolve, reject) => {
    StockLog.find({}, {_id: 0}, (err, stocksLog) => {
      if(err) reject(err);
      resolve(stocksLog);
    });
  })
};

const getStockLog = (symbol) => {
  return new Promise((resolve, reject) => {
    StockLog.findOne({'symbol': symbol}, {_id: 0}, (err, stocksLog) => {
      if(err) reject(err);
      resolve(stocksLog);
    });
  })
};

const getCount = () => {
  return new Promise((resolve, reject) => {
    StockLog.count({}, (err, count) => {
      if(err) reject(err);
      resolve(count);
    });
  });
};

const appendDataToStock = (dataSet) => {
  let dataPoint = {
    "avgCallsIV": dataSet.avgCallsIV,
    "avgPutsIV": dataSet.avgPutsIV,
    "underlyingStock": dataSet.underlyingStock
  };

  return StockLog.collection.update(
    {'symbol': dataSet.symbol},
    { $push: { dataPoint }},
    { upsert: true }, (err) => {
      if(err) next(err);
    console.log("Snapshot complete!" + dataSet.symbol);
  });
};

const bulkAppendDataToStock = (dataSets) => {
  const bulk = StockLog.collection.initializeUnorderedBulkOp();
  dataSets.map((dataSet) => {
    let dataPoint = {
      "avgCallsIV": dataSet.avgCallsIV,
      "avgPutsIV": dataSet.avgPutsIV,
      "underlyingStock": dataSet.underlyingStock
    };

    bulk.find({'symbol': dataSet.symbol}).updateOne({
      '$push':  { dataPoint }
    });

    let newDataPoint = {
      'symbol': dataSet.symbol,
      'dataSets': [dataPoint]
    }

    bulk.find({'symbol': dataSet.symbol}).upsert().updateOne({
      '$setOnInsert': newDataPoint
    });
  });
  bulk.execute();
  console.log("Bulk Snapshot complete !");
};

module.exports =  {
  getStocksLog,
  getStockLog,
  getCount,
  appendDataToStock,
  bulkAppendDataToStock
}
