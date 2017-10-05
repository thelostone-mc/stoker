const request = require("request");

/*
 * Returns an array of key value pair currency/price
 */
const tickers = () => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url: 'https://koinex.in/api/dashboards/ticker',
      headers: {
        'accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
      }
    };

    request.get(options, (error, response, body) => {
      if(error) {
        const _error = {
          name: "currentPrice",
          msg: "unable to fetch list",
          stacktrace: error
        };
        reject(_error);
      }

      const tickers = JSON.parse(body);
      resolve(tickers);
    });
  });
}

/*
 * Fetches price for last 'n' days for a a given currency
 * currency : string
 * days     : number // Default : 30
 */
const history = async (currency, days) => {
  return new Promise((resolve, reject) => {

    if(!days) days = 30;

    const options = {
      method: 'GET',
      url: "https://koinex.in/api/dashboards/fetch_chart_data?days=" + days +
        "&target_currency=" + currency,
      headers: {
        'accept': 'application/json',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
      }
    };

    request.get(options, (error, response, body) => {
      if(error) {
        const _error = {
          name: "fetchHistory",
          msg: "unable to retrieve list for " + currency,
          stacktrace: error
        };
        reject(_error);
      }

      resolve(body);
    });
  });
}

module.exports = {
  tickers,
  history
}
