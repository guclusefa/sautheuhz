var db = require('../config/database');
module.exports= {
    afficher_liste_medecins:function(callback){
        var sql ='SELECT * FROM Medecins';
        db.query(sql, function(err,data,fields){
            if (err)throw err;
            return callback(data);
        });
    }
}