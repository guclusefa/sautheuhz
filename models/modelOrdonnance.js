var db = require('../config/database');
module.exports = {
    afficher_liste_ordonnances: function (callback) {
        var sql = 'SELECT * FROM Ordonnances WHERE Ordonnances_id >73';
        var sql2 = 'SELECT DATE_FORMAT(Ordonnances_date, "%d/%m/%Y") as dateOrdo, idOrdo, DATEDIFF(max(Prescriptions_dateFin), Ordonnances_date) AS dureeOrdonnance, clients_nom, clients_prenom, Medecins_nom, Medecins_prenom, Pathologies_libelle FROM Pathologies, Medecins, Clients, Ordonnances, Prescriptions WHERE idPath = Pathologies_id AND idOrdo = Ordonnances_id AND clients_id = idClient AND idMedecin = Medecins_id AND Ordonnances_id >73 GROUP BY idOrdo ORDER BY dureeOrdonnance DESC'
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
    afficher_form_ordonnance: function (callback) {
        var sql = 'SELECT clients_id, clients_nom, clients_prenom FROM Clients';
        var sql2 = 'SELECT Medecins_id, Medecins_nom, Medecins_prenom FROM Medecins'
        var sql3 = 'SELECT Pathologies_id, Pathologies_libelle FROM Pathologies'
        var sql4 = 'SELECT Medicaments_id, Medicaments_libelle FROM Medicaments'

        db.query(sql, function (err, dataClient, fields) {
            if (err) throw err;
            db.query(sql2, function (err, dataMedecin, fields) {
                if (err) throw err;
                db.query(sql3, function (err, dataPath, fields) {
                    if (err) throw err;
                    db.query(sql4, function (err, dataMedicament, fields) {
                        if (err) throw err;
                        return callback(dataClient, dataMedecin, dataPath, dataMedicament);
                    });
                });
            });
        });
    },
    afficher_fiche_ordonnance: function (myID, callback) {
        var sql = 'SELECT clients_id, clients_nom, clients_prenom FROM Clients';
        var sql2 = 'SELECT *, DATE_FORMAT(Ordonnances_date, "%Y-%m-%d") as dateOrdo, DATE_FORMAT(Prescriptions_dateFin, "%Y-%m-%d") as datePresc FROM Ordonnances, Prescriptions WHERE idOrdo = Ordonnances_id AND idOrdo = ?'
        var sql3 = 'SELECT Medecins_id, Medecins_nom, Medecins_prenom FROM Medecins'
        var sql4 = 'SELECT Pathologies_id, Pathologies_libelle FROM Pathologies'
        var sql5 = 'SELECT Medicaments_id, Medicaments_libelle FROM Medicaments'

        db.query(sql, myID, function (err, dataClient, fields) {
            if (err) throw err;
            db.query(sql2, myID, function (err, dataInfoOrdo, fields) {
                if (err) throw err;
                db.query(sql3, myID, function (err, dataMedecin, fields) {
                    if (err) throw err;
                    db.query(sql4, myID, function (err, dataPath, fields) {
                        if (err) throw err;
                        db.query(sql5, myID, function (err, dataMedicament, fields) {
                            if (err) throw err;
                            return callback(dataClient, dataInfoOrdo, dataMedecin, dataPath, dataMedicament);
                        });

                    });

                });

            });

        });
    },
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
    executer_form_ordonnance_prescription: function (prescriptionParam, callback) {
        var sql = 'INSERT INTO Prescriptions SET ? ';
        db.query(sql, prescriptionParam, function (err, data) {
            if (err) throw err;
            return callback(data);

        });
    },
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



    delete_fiche_ordonnance: function (myID, callback) {
        var sql = 'DELETE FROM Ordonnances WHERE Ordonnances_id = ?'
        db.query(sql, myID, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    }
}