var express = require('express');
var router = express.Router();
var moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.all("/save", function(req, res){
  var dados = req.query

  
})

module.exports = router;
