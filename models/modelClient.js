var db = require('../config/database');
module.exports= {
    afficher_liste_clients:function(callback){
        var sql ='SELECT clients_id, idMutuelle, clients_noSS, clients_nom, clients_prenom, clients_sexe, DATE_FORMAT(clients_dateNaissance, "%d/%m/%Y") as clients_dateNaissance, clients_tel, clients_mail, clients_adresse, clients_ville , clients_cp, idMutuelle, Mutuelles_id, Mutuelles_Nom FROM Clients, Mutuelles WHERE idMutuelle = Mutuelles_id AND clients_id <>29';
        db.query(sql, function(err,data,fields){
            if (err)throw err;
            return callback(data);
        });
    },
    afficher_form_client: function(callback){
        var sql ='SELECT Mutuelles_nom, Mutuelles_id FROM Mutuelles';
        db.query(sql, function(err,data,fields){
            if (err)throw err;
            return callback(data);
        });
    },
    afficher_fiche_client: function(myID, callback){
        var sql = 'SELECT *, DATE_FORMAT(clients_dateNaissance, "%Y-%m-%d") as dateN FROM Clients WHERE clients_id = ?' ;
        var sql2 = 'SELECT Mutuelles_nom, Mutuelles_id FROM Mutuelles'
        db.query(sql, myID, function(err,data,fields){
            if(err)throw err;
            db.query(sql2,function(err,data2,fields){

                return callback(data, data2);
            })
        });
    },
    executer_form_client: function(clientParam, callback){
        var sql= 'INSERT INTO Clients SET ? ' ;
        db.query(sql,clientParam, function(err, data){
            if(err)throw err;
            return callback(data);
        });
    },
    update_form_client: function(clientParam,myID, callback){
        var sql = 'UPDATE Clients SET ? WHERE clients_id = ?' ;
        db.query(sql, clientParam, myID, function(err, data,fields){
            if(err)throw err;
            return callback(data);
        });
    },
    delete_fiche_client: function(myID, callback){
        var sql = 'DELETE FROM Clients WHERE clients_id = ?'
        db.query(sql, myID, function(err,data,fields){
            if(err)throw err;
            return callback(data);
        });
    }
}