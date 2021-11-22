var db = require('../config/database');
module.exports = {
    afficher_liste_stocks: function (callback) {
        // marche mais il faut prendre en compte les jours restant et non les jours total lors du calcul de la fréquence, fix a faire dans la requete sql2 -> a faire
        // sql prend les prescriptions finis, sql2 prend tout les meds, sql3 prend les meds qui nont pas de prescriptions
        // il suffit de soustraire les stock nessaire de la sql1 (car fini) et sql2 pour avoir le stock necessaire réel, puis d'ajouter dans la liste les meds dans aucun prescription -> fix le probleme de bdd avec colonnes intermdiaire
        var sql = 'SELECT *, idMedicament, SUM(Prescriptions_quantite*Prescriptions_frequence*(Prescriptions_dateFin - Ordonnances_date)) as stock_necessaire FROM Prescriptions, Ordonnances, Medicaments WHERE Medicaments_id = idMedicament AND idOrdo = Ordonnances_id AND Prescriptions_dateFin < NOW() GROUP BY idMedicament ORDER BY Prescriptions_dateFin, idMedicament';
        var sql2 = 'SELECT *, idMedicament, SUM(Prescriptions_quantite*Prescriptions_frequence*(DATEDIFF(Prescriptions_dateFin, NOW()))) as stock_necessaire FROM Prescriptions, Ordonnances, Medicaments WHERE Medicaments_id = idMedicament AND idOrdo = Ordonnances_id GROUP BY idMedicament ORDER BY Prescriptions_dateFin, idMedicament';
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
    afficher_form_stock: function (callback) {
        return callback();
    },
    afficher_fiche_stock: function (myID, callback) {
        var sql = 'SELECT * FROM Medicaments WHERE Medicaments_id = ?';
        db.query(sql, myID, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    },

    executer_form_stock: function (med_libelle, med_qte, callback) {
        var sql = 'INSERT INTO Medicaments (Medicaments_libelle, Medicaments_qte)VALUES (?, ?)';
        db.query(sql, med_libelle, med_qte, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    },

    update_form_stock: function (med_libelle, med_qte, med_id, callback) {
        var sql = 'UPDATE Medicaments SET Medicaments_libelle = ?, Medicaments_qte = ? WHERE Medicaments_id = ?';
        db.query(sql, med_libelle, med_qte, med_id, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    },

    delete_fiche_stock: function (myID, callback) {
        var sql = 'DELETE FROM Medicaments WHERE Medicaments_id = ?'
        db.query(sql, myID, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    }
}