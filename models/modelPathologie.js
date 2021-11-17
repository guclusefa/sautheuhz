var db = require('../config/database');
module.exports= {
    afficher_liste_pathologies:function(callback){
        var sql ='SELECT * FROM Pathologies';
        db.query(sql, function(err,data,fields){
            if (err)throw err;
            return callback(data);
        });
    },
    afficher_form_pathologie: function(callback){
        return callback();
    },
    afficher_fiche_pathologie: function(myID, callback){
        var sql = 'SELECT * FROM Pathologies WHERE Pathologies_id = ?' ;
        db.query(sql, myID, function(err,data,fields){
            if(err)throw err;
            return callback(data);
        });
    },
    executer_form_pathologie: function(Pathologies_libelle, callback){
        var sql= 'INSERT INTO Pathologies SET ? ' ;
        db.query(sql,Pathologies_libelle, function(err, data){
            if(err)throw err;
            return callback(data);
        });
    },
    update_form_pathologie: function(Pathologies_libelle,myID, callback){
        var sql = 'UPDATE Pathologies SET ? WHERE Pathologies_id = ?' ;
        db.query(sql, Pathologies_libelle, myID, function(err, data,fields){
            if(err)throw err;
            return callback(data);
        });
    },
    delete_fiche_pathologie: function(myID, callback){
        var sql = 'DELETE FROM Pathologies WHERE Pathologies_id = ?'
        db.query(sql, myID, function(err,data,fields){
            if(err)throw err;
            return callback(data);
        });
    }




}