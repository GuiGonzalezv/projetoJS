var express = require('express');
var router = express.Router();
var nosql = require("../lib/nosql.js")
var moment = require('moment-timezone');
var md5 = require('md5');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.all("/save", function(req, res){
  
	var dados = req.query

	dados.link = md5(dados.titulo)

	dados.criadoEm = new moment().toDate()

	var dataExpiracao = new moment()
	var err = {}
	if(dados){
		
		if(dados.expira == "5 min"){
			dataExpiracao.add(5, 'minutes')
			dataExpiracao = dataExpiracao.toDate()		
		}
		else if(dados.expira == "10 min"){
			dataExpiracao.add(10, 'minutes')
			dataExpiracao = dataExpiracao.toDate()	
		}
		else if(dados.expira == "1 Semana"){
			dataExpiracao.add(1, 'week')
			dataExpiracao = dataExpiracao.toDate()	
		}
		else if(dados.expira == "1 Mes"){
			dataExpiracao.add(1, 'month')
			dataExpiracao = dataExpiracao.toDate()	
		}
		else if(dados.expira == "1 Ano"){
			dataExpiracao.add(1, 'year')
			dataExpiracao = dataExpiracao.toDate()	
		}else{
			dataExpiracao = false
		}
		dados.expira = dataExpiracao

		if(!dados.titulo){
			err.titulo = "Insira um titulo correto!"
		}
		else if(!dados.texto){
			err.texto = "Insira o texto!"
		}
		if(Object.keys(err).length == 0){
			nosql.getDB(function(db){

				db.collection("pasteBin").insertOne(dados, function(err, result){
					if(err){
						err.geral = "Erro ao inserir os dados"
						res.json({
							status: 404,
							dados: err
						})
					}else{
						res.json({
							status: 200,
							dados: dados
						})
					}
				})

				
			})
			// console.log("salvo")
			
		}else{
			res.json({
				status: 404,
				dados: err
			})
		}

	}else{
		err.geral = "Insira os dados corretamente!"
	}


  
})

module.exports = router;
