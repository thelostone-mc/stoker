const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var StockSchema = new Schema({
  symbol: String,
  callsIV: Number,
  putsIV: Number,
  underlyingStock: Number
});

mongoose.model('Stock', StockSchema);
