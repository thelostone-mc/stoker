const request = require("request"),
  cheerio = require("cheerio"),
  cheerioTableparser = require("cheerio-tableparser"),
  stockList = require('./list');

const CALLS_IV_ID = 4;
const STOCK_PRICE_ID = 11;
const PUTS_IV_ID = 18;

const DECIMAL = 100;

const fetchGoogleFinance = (stockSymbols) => {
  return new Promise((resolve, reject) => {
    if(!stockSymbols) {
      console.log("fetchGoogleFinance: stocks not found. Using stockList");
      stockSymbols = stockList.stocks;
    }

    const query = stockSymbols.join();

    const options = {
      method: 'GET',
      url: 'http://finance.google.com/finance/info',
      qs: { client: 'ig', q: query },
    }

    request(options, (error, response, body) => {
      if (error) {
        console.log("Error crawling in fetchGoogleFinance: " +
          stockSymbol + "\t" + error);
        return reject(error);
      }
      resolve(body);
    });
  });
};

const fetchIV = (stockSymbol) => {
  return new Promise((resolve, reject) => {
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
        console.log("Error crawling: " + stockSymbol + "\t" + error);
        return reject(error)
      }

      const $ = cheerio.load(body);
      const underlyingStock = stockPriceCleanser($('span').filter(() => {
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

        if(data) {
          dataPoint.avgCallsIV = data.avgCallsIV;
          dataPoint.avgPutsIV = data.avgPutsIV;
        }
        else
          console.log(stockSymbol +
            "'s currentStock price is outside the options ladder");

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
  list.forEach((item, index, arr) => {
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

module.exports = {
  fetchIV,
  fetchGoogleFinance
};
