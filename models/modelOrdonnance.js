/*
Le model permet en autre d'écrire les requetes sql des différentes fonctions.
Le model Ordonnance permet de stocker les différentes requête concernant les Ordonnances, à savoir : 
    -afficher la liste des Ordonnances avec leurs données
    -afficher le formulaire d'ajout de Ordonnances en recupérant les données déja présentes dans la base (liste clients/medecins/pathologies/medicaments)
    -afficher une fiche individuelle sous forme de formulaire pour chaque Ordonnance, permettant également de modifier les données
    -éxécuter le formulaire d'ajout de Ordonnances
    -éxécuter le formulaire de modification des données Ordonnances
    -supprimer les données Ordonnances 
*/
var db = require('../config/database');
module.exports = {
//afficher la liste des Ordonnances avec leurs données
    afficher_liste_ordonnances: function (callback) {
        var sql = 'SELECT * FROM Ordonnances WHERE Ordonnances_id >73';
        var sql2 = 'SELECT DATE_FORMAT(Ordonnances_date, "%d/%m/%Y") as dateOrdo, idOrdo, DATEDIFF(max(Prescriptions_dateFin), Ordonnances_date) AS dureeOrdonnance, Ordonnances_nom, Ordonnances_prenom, Medecins_nom, Medecins_prenom, Pathologies_libelle FROM Pathologies, Medecins, Ordonnances, Ordonnances, Prescriptions WHERE idPath = Pathologies_id AND idOrdo = Ordonnances_id AND Ordonnances_id = idOrdonnance AND idMedecin = Medecins_id AND Ordonnances_id >73 GROUP BY idOrdo ORDER BY dureeOrdonnance DESC'
        var sql3 = 'SELECT *, DATEDIFF(Prescriptions_dateFin, Ordonnances_date) AS duree, DATE_FORMAT(Prescriptions_dateFin, "%d/%m/%Y") as dateFin FROM Prescriptions, Medicaments, Ordonnances WHERE idMedicament = Medicaments_id AND idOrdo = Ordonnances_id'
        db.query(sql, function (err, dataOrdo, fields) {
            if (err) throw err;
            db.query(sql2, function (err, dataDate, fields) {
                if (err) throw err;
                db.query(sql3, function (err, dataPrescription, fields) {
                    if (err) throw err;
                    return callback(dataOrdo, dataDate, dataPrescription);
                });
            });

        });
    },
//afficher le formulaire d'ajout de Ordonnances en recupérant les données déja présentes dans la base (liste clients/medecins/pathologies/medicaments)
    afficher_form_ordonnance: function (callback) {
        var sql = 'SELECT Ordonnances_id, Ordonnances_nom, Ordonnances_prenom FROM Ordonnances';
        var sql2 = 'SELECT Medecins_id, Medecins_nom, Medecins_prenom FROM Medecins'
        var sql3 = 'SELECT Pathologies_id, Pathologies_libelle FROM Pathologies'
        var sql4 = 'SELECT Medicaments_id, Medicaments_libelle FROM Medicaments'

        db.query(sql, function (err, dataOrdonnance, fields) {
            if (err) throw err;
            db.query(sql2, function (err, dataMedecin, fields) {
                if (err) throw err;
                db.query(sql3, function (err, dataPath, fields) {
                    if (err) throw err;
                    db.query(sql4, function (err, dataMedicament, fields) {
                        if (err) throw err;
                        return callback(dataOrdonnance, dataMedecin, dataPath, dataMedicament);
                    });
                });
            });
        });
    },
//afficher une fiche individuelle sous forme de formulaire pour chaque Ordonnance, permettant également de modifier les données
    afficher_fiche_ordonnance: function (myID, callback) {
        var sql = 'SELECT Ordonnances_id, Ordonnances_nom, Ordonnances_prenom FROM Ordonnances';
        var sql2 = 'SELECT *, DATE_FORMAT(Ordonnances_date, "%Y-%m-%d") as dateOrdo, DATE_FORMAT(Prescriptions_dateFin, "%Y-%m-%d") as datePresc FROM Ordonnances, Prescriptions WHERE idOrdo = Ordonnances_id AND idOrdo = ?'
        var sql3 = 'SELECT Medecins_id, Medecins_nom, Medecins_prenom FROM Medecins'
        var sql4 = 'SELECT Pathologies_id, Pathologies_libelle FROM Pathologies'
        var sql5 = 'SELECT Medicaments_id, Medicaments_libelle FROM Medicaments'

        db.query(sql, myID, function (err, dataOrdonnance, fields) {
            if (err) throw err;
            db.query(sql2, myID, function (err, dataInfoOrdo, fields) {
                if (err) throw err;
                db.query(sql3, myID, function (err, dataMedecin, fields) {
                    if (err) throw err;
                    db.query(sql4, myID, function (err, dataPath, fields) {
                        if (err) throw err;
                        db.query(sql5, myID, function (err, dataMedicament, fields) {
                            if (err) throw err;
                            return callback(dataOrdonnance, dataInfoOrdo, dataMedecin, dataPath, dataMedicament);
                        });

                    });

                });

            });

        });
    },
//éxécuter le formulaire d'ajout de Ordonnances
    executer_form_ordonnance: function (ordonnanceParam, callback) {
        var sql = 'INSERT INTO Ordonnances SET ? ';
        var sql2 = 'SELECT Ordonnances_id FROM Ordonnances ORDER BY Ordonnances_id DESC'
        db.query(sql, ordonnanceParam, function (err, data) {
            if (err) throw err;
            db.query(sql2, function (err, data2) {
                if (err) throw err;
                return callback(data2);
            });
        });
    },
//éxécuter le formulaire d'ajout de Ordonnances (suite des requetes necessaires)
    executer_form_ordonnance_prescription: function (prescriptionParam, callback) {
        var sql = 'INSERT INTO Prescriptions SET ? ';
        db.query(sql, prescriptionParam, function (err, data) {
            if (err) throw err;
            return callback(data);

        });
    },
//éxécuter le formulaire de modification des données Ordonnances
    update_form_ordonnance: function (ordonnanceParam, idOrdo, callback) {
        var sql = 'UPDATE Ordonnances SET ? WHERE Ordonnances_id = ?';
        db.query(sql, ordonnanceParam, idOrdo, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    },
    update_form_ordonnance_delete: function (idOrdo, callback) {
        var sql2 = 'DELETE FROM Prescriptions WHERE idOrdo = ?';
        db.query(sql2, idOrdo, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });;

    },
//supprimer les données Ordonnances 
    delete_fiche_ordonnance: function (myID, callback) {
        var sql = 'DELETE FROM Ordonnances WHERE Ordonnances_id = ?'
        db.query(sql, myID, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    }
}