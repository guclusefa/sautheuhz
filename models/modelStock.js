var db = require('../config/database');
module.exports= {
    afficher_liste_stocks:function(callback){
        var sql ='SELECT * FROM Stocks, Medicaments WHERE Medicaments_id = idMedicament ';
        var sql2 ='SELECT idMedicament, SUM(Prescriptions_quantite*Prescriptions_frequence*(Prescriptions_dateFin - Ordonnances_date)) as stock_necessaire FROM Prescriptions, Ordonnances WHERE idOrdo = Ordonnances_id AND Prescriptions_dateFin >= NOW() GROUP BY idMedicament ';

        db.query(sql, function(err,data,fields){
            if (err)throw err;
            db.query(sql2, function(err,data2,fields){
                if (err)throw err;
                return callback(data, data2);
            });
        });
    },
    afficher_form_stock: function(callback){
        return callback();
    },
    afficher_fiche_stock: function(myID, callback){
        var sql = 'SELECT * FROM Stocks, Medicaments WHERE Medicaments_id = ?' ;
        db.query(sql, myID, function(err,data,fields){
            if(err)throw err;
            return callback(data);
        });
    },
    executer_form_stock: async function(sqlParam1, callback){
        var sql = 'INSERT INTO Medicaments SET ? ';
        var sql2 = 'SELECT Medicaments_id FROM Medicaments ORDER BY Medicaments_id DESC'
        db.query(sql, sqlParam1, function (err, data) {
            if (err) throw err;
            db.query(sql2, function (err, medicamentId) {
                if (err) throw err;
                return callback(medicamentId);
            });
        });
    },
    executer_form_stock_suite: function(slqParam2,sqlParam3, callback){
        var sql = 'INSERT INTO Stocks SET ? ';
        db.query(sql, slqParam2, function(err,fields){
            if(err)throw err;
        });
    },
    executer_form_stock_suite2:function(sqlParam3, callback){
        var sql2 = 'INSERT INTO Prescriptions SET ?  '
        db.query(sql2, sqlParam3, function(err,data,fields){
            console.log(sql2)
            if(err)throw err;
            return callback(data);
        });
    },
}