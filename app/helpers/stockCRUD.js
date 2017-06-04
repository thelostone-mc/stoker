const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      Stock = mongoose.model('Stock');

const bulkInsert = (dataPoints) => {
  Stock.collection.insert(dataPoints, (err) => {
    if(err)
      next(err);
    console.log("Bulk Insert Done!");
  });
}

const insertOne = (dataPoint) => {
  Stock.collection.save(dataPoint, (err) => {
    if(err)
      next(err);
  });
}

const getCount = new Promise((resolve, reject) => {
  Stock.count({}, function(err, count) {
    if(err) reject(err);
    resolve(count);
  });
});

module.exports =  {
  bulkInsert,
  insertOne,
  getCount
}
