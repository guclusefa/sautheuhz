/*
Le model permet en autre d'écrire les requetes sql des différentes fonctions.
Le model Stock permet de stocker les différentes requête concernant les Stocks, à savoir : 
    -afficher la liste des Stocks avec leurs données
    -afficher le formulaire d'ajout de Stocks
    -afficher une fiche individuelle sous forme de formulaire pour chaque Stock, permettant également de modifier les données
    -éxécuter le formulaire d'ajout de Stocks
    -éxécuter le formulaire de modification des données Stocks
    -supprimer les données Stocks 
*/

var db = require('../config/database');
module.exports = {
//afficher la liste des Stocks avec leurs données
    afficher_liste_stocks: function (callback) {
        var sql = 'SELECT *, idMedicament, SUM(Prescriptions_quantite*Prescriptions_frequence*(Prescriptions_dateFin - Ordonnances_date)) as stock_necessaire FROM Prescriptions, Ordonnances, Medicaments WHERE Medicaments_id = idMedicament AND idOrdo = Ordonnances_id AND Prescriptions_dateFin < NOW() GROUP BY idMedicament ORDER BY Prescriptions_dateFin, idMedicament';
        var sql2 = 'SELECT *, DATEDIFF(Prescriptions_dateFin, NOW()) as joursRestant, idMedicament, SUM(Prescriptions_quantite*Prescriptions_frequence*(DATEDIFF(Prescriptions_dateFin, NOW()))) as stock_necessaire FROM Prescriptions, Ordonnances, Medicaments WHERE Medicaments_id = idMedicament AND idOrdo = Ordonnances_id GROUP BY idMedicament ORDER BY Prescriptions_dateFin, idMedicament';
        var sql3 = 'SELECT * FROM Medicaments WHERE Medicaments_id NOT IN (SELECT idMedicament FROM Prescriptions)'
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            db.query(sql2, function (err, data2, fields) {
                if (err) throw err;
                db.query(sql3, function (err, data3, fields) {
                    return callback(data, data2, data3);
                });
            });
        });
    },
//afficher le formulaire d'ajout de Stocks
    afficher_form_stock: function (callback) {
        return callback();
    },
//afficher une fiche individuelle sous forme de formulaire pour chaque Stock, permettant également de modifier les données
    afficher_fiche_stock: function (myID, callback) {
        var sql = 'SELECT * FROM Medicaments WHERE Medicaments_id = ?';
        db.query(sql, myID, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    },
//éxécuter le formulaire d'ajout de Stocks
    executer_form_stock: function (med_libelle, med_qte, callback) {
        var sql = 'INSERT INTO Medicaments (Medicaments_libelle, Medicaments_qte)VALUES (?, ?)';
        db.query(sql, med_libelle, med_qte, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    },
//éxécuter le formulaire de modification des données Stocks
    update_form_stock: function (med_libelle, med_qte, med_id, callback) {
        var sql = 'UPDATE Medicaments SET Medicaments_libelle = ?, Medicaments_qte = ? WHERE Medicaments_id = ?';
        db.query(sql, med_libelle, med_qte, med_id, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    },
//supprimer les données Stocks 
    delete_fiche_stock: function (myID, callback) {
        var sql = 'DELETE FROM Medicaments WHERE Medicaments_id = ?'
        db.query(sql, myID, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    }
}