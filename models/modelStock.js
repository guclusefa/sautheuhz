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
    executer_form_stock: function(MedLibelParam, callback){
        var sql= 'INSERT INTO Medicaments SET ? ' ;
        var sql2 = 'SELECT Medicaments_id FROM Medicaments ORDER BY Medicaments_id DESC'
        
        db.query(sql,MedLibelParam, function(err, data){
            if(err)throw err;
            db.query(sql2, function(err, dataMedic){
                if(err)throw err;
                return callback(dataMedic);
            });
        });
    },
    executer_form_stock_suite: function(stockParam,idMedicament, callback){
        
    },
}