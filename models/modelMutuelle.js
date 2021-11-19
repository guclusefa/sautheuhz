var db = require('../config/database');
module.exports= {
    afficher_liste_mutuelles:function(callback){
        var sql = 'SELECT * FROM Mutuelles'
        db.query(sql, function(err,data,fields){
            if (err)throw err;
            return callback(data);
        });
    }, 
    afficher_form_mutuelle: function(callback){
        return callback();
    },
    afficher_fiche_mutuelle: function(myID,callback){
        var sql = 'SELECT * FROM Mutuelles WHERE Mutuelles_id =?'
        db.query(sql, myID, function(err,data,fields){
            if(err)throw err;
            return callback(data);
        });
    },
    executer_form_mutuelle: function(Mutuelles_nom,Mutuelles_tel, Mutuelles_mail, callback){
        var sql= 'INSERT INTO Mutuelles SET ? ' ;
        db.query(sql,Mutuelles_nom, Mutuelles_tel, Mutuelles_mail, function(err, data){
            if(err)throw err;
            return callback(data);
        });
    },
    update_form_mutuelle: function(medecinParam,myID, callback){
        var sql = 'UPDATE Mutuelles SET  ? WHERE Mutuelles_id = ?' ;
        db.query(sql, medecinParam, myID, function(err, data,fields){
            if(err)throw err;
            return callback(data);
        });
    },
    delete_fiche_mutuelle:function(myID, callback){
        var sql = 'DELETE FROM Mutuelles WHERE Mutuelles_id = ?'
        db.query(sql, myID, function(err,data,fields){
            if(err)throw err;
            return callback(data);
        });
    }




}



