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
   /* executer_form_stock: async function(sqlParam1, callback){
        var sql = 'INSERT INTO Medicaments SET ? ';
        var sql2 = 'SELECT Medicaments_id FROM Medicaments ORDER BY Medicaments_id DESC'
        db.query(sql, sqlParam1, function (err, data) {
            if (err) throw err;
            db.query(sql2, function (err, medicamentId) {
                if (err) throw err;
                console.log(medicamentId)
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
    executer_form_stock_suite2:function(idMedicament, callback){
        var sql2 = `INSERT INTO Prescriptions (idOrdo, idMedicament, Prescriptions_quantite, Prescriptions_frequence, Prescriptions_dateFin) VALUES (73, ? , 0, 0, '2099-11-01') `
        db.query(sql2, idMedicament, function(err,data,fields){
            if(err)throw err;
            return callback(data);
        });
    },*/
    update_form_stock: function (sql1Param, Medicaments_id, callback) {
        var sql = 'UPDATE Medicaments SET ? WHERE Medicaments_id = ?';
        db.query(sql, sql1Param, Medicaments_id, function (err, data, fields) {
            if (err) throw err; 
            return callback(data);

            
        });
    },
    update_form_stock2: function (sql2Param, sql2_2Param, callback) {
        var sql2 = 'UPDATE Stocks SET ? WHERE idMedicament = ?'
        
            db.query(sql2, sql2Param, sql2_2Param, function (err, data2, fields) {
                if (err) throw err;
                return callback(data2);
            });
        
    },



    
    delete_fiche_stock: function (myID, callback) {
        var sql = 'DELETE FROM Stocks WHERE idMedicament = ?'
        db.query(sql, myID, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    }
}