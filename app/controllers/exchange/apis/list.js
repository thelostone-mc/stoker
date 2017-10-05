const express = require('express'),
  router = express.Router(),
  fetchKoinex = require('../modules/koinex/fetch');

module.exports = app => {
  app.use('/', router);

  router.get('/exchange/list', async (req, res, next) => {
    // TODO: SQL injection check
    let query = req.query.name ? req.query.name : 'all' ;
    let tickers =[];
    switch (query) {
      case 'koinex':
        tickers = await fetchKoinex.tickers();
        // TODO : Update DB
        break;
    }

    res.send(tickers);
  });
}
