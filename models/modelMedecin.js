var db = require('../config/database');
module.exports= {
    afficher_liste_medecins:function(callback){
        var sql ='SELECT * FROM Medecins';
        db.query(sql, function(err,data,fields){
            if (err)throw err;
            return callback(data);
        });
    },
    afficher_form_medecin: function(callback){
        return callback();
    },
    afficher_fiche_medecin: function(myID, callback){
        var sql = 'SELECT * FROM Medecins WHERE Medecins_id = ?' ;
        db.query(sql, myID, function(err,data,fields){
            if(err)throw err;
            return callback(data);
        });
    },
    executer_form_medecin: function(medecinOrdreNo,medecinNom, medecinPrenom, medecinTel, MedecinMail, callback){
        var sql= 'INSERT INTO Medecins SET ? ' ;
        db.query(sql,medecinOrdreNo, medecinNom, medecinPrenom,medecinTel, MedecinMail, function(err, data){
            if(err)throw err;
            return callback(data);
        });
    },
    update_form_medecin: function(medecinParam,myID, callback){
        var sql = 'UPDATE Medecins SET ? WHERE Medecins_id = ?' ;
        db.query(sql, medecinParam, myID, function(err, data,fields){
            if(err)throw err;
            return callback(data);
        });
    },
    delete_fiche_medecin: function(myID, callback){
        var sql = 'DELETE FROM Medecins WHERE Medecins_id = ?'
        db.query(sql, myID, function(err,data,fields){
            if(err)throw err;
            return callback(data);
        });
    }

}