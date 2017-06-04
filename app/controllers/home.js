var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  crawler = require('../helpers/crawler'),
  fixture = require('../helpers/fixture'),
  Stock = mongoose.model('Stock');
  StockLog = mongoose.model('StockLog');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {

  // Intitalize
  Stock.count({}, function(err, count){
    if(err) return next(err);

    if(count == 0) {
      console.log("DataPoint Count: ", count);
      fixture.intitalizeDump();
    }
  });

  res.send("shitzu");
});
