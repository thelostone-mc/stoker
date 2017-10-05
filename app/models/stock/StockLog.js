const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var StockLogSchema = new Schema({
  symbol: String,
  dataSet: [{
    callsIV: Number,
    putsIV: Number,
    underlyingStock: Number
  }]
});

mongoose.model('StockLog', StockLogSchema);
