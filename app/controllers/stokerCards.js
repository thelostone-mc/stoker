let express = require('express'),
  router = express.Router();

module.exports = function(app) {
  app.use('/', router);

  router.get('/stokercards', async function (req, res, next) {
    res.render('card');
  });
}
