const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Stock = mongoose.model('Stock');

const bulkInsert = function(dataPoints) {
  Stock.collection.insert(dataPoints, (err) => {
    if(err)
      next(err);
  });
}

const insertOne = function(dataPoint) {
  Stock.collection.save(dataPoint, (err) => {
    if(err)
      next(err);
  });
}

module.exports =  {
  bulkInsert,
  insertOne
}
