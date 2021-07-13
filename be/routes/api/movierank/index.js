var express = require('express');
var createError = require('http-errors');
var router = express.Router();
const MovieRank = require('../../../models/movierank')

// MovieRank 리스트 
router.get('/list/rank', (req, res, next) => {
    MovieRank.find()
      .then(rs => {
        res.send({ success: true, ds: rs, token: req.token})
      })
      .catch(e => {
        res.send({ success: false, msg: e.message })
      })
  });
module.exports = router;
