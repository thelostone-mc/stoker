const request = require("request");
const cheerio = require("cheerio");
const cheerioTableparser = require("cheerio-tableparser");

const CALLS_IV_ID = 4;
const STOCK_PRICE_ID = 11;
const PUTS_IV_ID = 18;

const DECIMAL = 100;

const fetchIV = (stockSymbol) => {
  return new Promise((resolve) => {
    const url = "https://nseindia.com/live_market/dynaContent/live_watch/option_chain/optionKeys.jsp";
    const options = {
      method: 'GET',
      url: url,
      qs: { symbol: stockSymbol.toString() },
      headers: {'user-agent': 'node.js'}
    };
    let dataPoint = {};

    request(options, (error, response, body) => {
      if (error || response.statusCode != 200) {
        throw new Error("Error crawling: " + stockSymbol + "\t" + error);
      }

      const $ = cheerio.load(body);
      const underlyingStock = stockPriceCleanser($('span').filter(function() {
        return $(this).text().indexOf('Underlying Stock:') > -1;
      }).text());

      dataPoint = {
        "symbol": stockSymbol.toString(),
        "underlyingStock": underlyingStock,
        "avgCallsIV": 0,
        "avgPutsIV": 0
      };

      if(underlyingStock.trim() == "") {
        console.log(stockSymbol.toString() + ": No contracts traded today");
      }
      else {
        cheerioTableparser($);
        const parsedTable = $("#octable").parsetable(true, true, true);
        data = tableCleanser(parsedTable, underlyingStock);

        dataPoint.avgCallsIV = data.avgCallsIV;
        dataPoint.avgPutsIV = data.avgPutsIV;
      }
      resolve(dataPoint);
    });
  });
}

const IVAggregator = (parsedTable, index) => {
  const callsIVList=  parsedTable[CALLS_IV_ID];
  const putsIVList=  parsedTable[PUTS_IV_ID];
  const stockPriceList = parsedTable[STOCK_PRICE_ID];

  let dataPoint = {
    "avgCallsIV": average([ Number.parseFloat(callsIVList[index-1]),
                    Number.parseFloat(callsIVList[index])]),
    "avgPutsIV": average([ Number.parseFloat(putsIVList[index-1]),
                    Number.parseFloat(putsIVList[index])])
  };

  return dataPoint;
}

const tableCleanser = (parsedTable, underlyingStock) => {
  const stockPriceList = parsedTable[STOCK_PRICE_ID];
  for(let i = 0; i <= stockPriceList.length; i++) {
      const stockPrice = Number.parseInt(stockPriceList[i]);
      if(!isNaN(stockPrice) && stockPrice > underlyingStock) {
        return IVAggregator(parsedTable, i);
      }
  }
}

const stockPriceCleanser = (underlyingStock) => {
  return underlyingStock.split(" ").pop().trim();
}

const average = (list) => {
  let sum = 0, length = 0;
  list.forEach(function(item, index, arr){
    if(!isNaN(item)) {
      sum += item;
      length += 1;
    }
  });

  if(length == 0) {
    length = 1;
  }

  return (sum / length).toFixed(2);
}

module.exports.fetchIV = fetchIV;
