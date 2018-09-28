// Conexao com o banco de dados Nosql Mongodb

var MongoClient = require('mongodb').MongoClient

module.exports = {

    getDB: function( callback ){
        MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, function(err, client){

            if(err){
                console.log('erro ao conectar com o banco')
            }else{

                var db = client.db('pastebin');
                callback( db )
            }
        })
    }
}