var express = require('express');
var router = express.Router();
var nosql = require("../lib/nosql.js")
var moment = require('moment-timezone');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.all("/save", function(req, res){
  
	var dados = req.query
	dados.link = "linkhttp: 2010231"

	var dataExpiracao = new moment()
	var err = {}
	if(dados){
		
		if(!dados.titulo){
			err.titulo = "Insira um titulo correto!"
		}
		if(!dados.texto){
			err.texto = "Insira o texto!"
		}
		if(Object.keys(err).length == 0){
			console.log("salvo")
			res.json({
				status: 200,
				dados: dados
			})
		}else{
			res.json({
				status: 404,
				dados: err
			})
		}

	}else{
		err.geral = "Insira os dados corretamente!"
	}

	dataExpiracao = dataExpiracao.toDate()
	console.log(dataExpiracao)

  
})

module.exports = router;
