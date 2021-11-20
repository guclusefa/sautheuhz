var db = require('../config/database');
module.exports= {
    afficher_accueil:function(callback){
        var sql ='SELECT * FROM Stocks, Medicaments WHERE Medicaments_id = idMedicament ';
        var sql2 ='SELECT  *, COUNT(*) as total FROM Pathologies, Ordonnances WHERE idPath = Pathologies_id AND Ordonnances_id > 73 GROUP BY idPath';
        var sql3 = 'SELECT * FROM Stocks, Medicaments WHERE Medicaments_id = idMedicament '
        db.query(sql, function(err,data,fields){
            if (err)throw err;
            db.query(sql2, function(err,data2,fields){
                if (err)throw err;
                db.query(sql3, function(err,data3,fields){
                    if (err)throw err;
                    return callback(data, data2, data3);
                });
            });
        });
    },
}