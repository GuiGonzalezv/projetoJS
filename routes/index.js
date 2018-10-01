var express = require('express');
var router = express.Router();
var nosql = require("../lib/nosql.js")
var moment = require('moment-timezone');
var md5 = require('md5');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.all("/servicos", function(req, res){
	nosql.getDB(function(db){
		var month = new moment().subtract(6, 'months').toDate()
		var agora = new moment().toDate()
		db.collection('pasteBin').aggregate([
			{
				$match: {
					$and: [{
						criadoEm: {
							$gte: new Date(month),
							$lte: new Date(agora)
						}
					}],
				}
			},
			{
				$group: {
					_id: {
						ano: {
							$year: "$criadoEm"
						},
						mes: {
							$month: "$criadoEm"
						},
						criado: "$criadoEm"
					},
					total: {$sum: 1}
                                        
				}
			}
			]).toArray(function(err, result){
				data = result
				var mes = ["teste", 'JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO']
				if(err){
					console.log("Error")
				}else{

					if(data.length > 0){
						x = {}

						data.map((e)=> {
							x.push({anoMes: ano+mes})
						})
					}
				}

			})
	})
	res.render("analytics")
})

function mensalAnalytics(){
	
}
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

router.all("/:link", function(req, res){
	var link = req.params.link

	nosql.getDB(function(db){
		db.collection("pasteBin").find({"link": link}).toArray(function(err, result){
			data = result[0]
			agora = new moment().toDate()
			if(data){
				if(data.expira > agora || data.expira == false){
					res.render('link', data)
				}else{
					res.render("linkExpirado", {title: "Link Expirado..."})
				}	
			}else{
				res.render("linkExpirado", {title: "Link não encontrado..."})
			}
			
		})
	})
})

module.exports = router;
