/*
Le model permet en autre d'écrire les requetes sql des différentes fonctions.
Le model Client permet de stocker les différentes requête concernant les clients, à savoir : 
    -afficher la liste des clients avec leurs données
    -afficher le formulaire d'ajout de clients en recupérant les données invariables (les mutuelles)
    -afficher une fiche individuelle sous forme de formulaire pour chaque client, permettant également de modifier les données
    -éxécuter le formulaire d'ajout de clients
    -éxécuter le formulaire de modification des données clients
    -supprimer les données clients 
*/
var db = require('../config/database');
module.exports = {
//afficher la liste des clients avec leurs données
    afficher_liste_clients: function (callback) {
        var sql = 'SELECT TIMESTAMPDIFF(YEAR, clients_dateNaissance, CURDATE()) AS age, clients_id, idMutuelle, clients_noSS, clients_nom, clients_prenom, clients_sexe, DATE_FORMAT(clients_dateNaissance, "%d/%m/%Y") as clients_dateNaissance, clients_tel, clients_mail, clients_adresse, clients_ville , clients_cp, idMutuelle, Mutuelles_id, Mutuelles_Nom FROM Clients, Mutuelles WHERE idMutuelle = Mutuelles_id ';
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    },
//afficher le formulaire d'ajout de clients en recupérant les données invariables (les mutuelles)
    afficher_form_client: function (callback) {
        var sql = 'SELECT Mutuelles_nom, Mutuelles_id FROM Mutuelles';
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    },
//afficher une fiche individuelle sous forme de formulaire pour chaque client, permettant également de modifier les données
    afficher_fiche_client: function (myID, callback) {
        var sql = 'SELECT *, DATE_FORMAT(clients_dateNaissance, "%Y-%m-%d") as dateN FROM Clients WHERE clients_id = ?';
        var sql2 = 'SELECT Mutuelles_nom, Mutuelles_id FROM Mutuelles'
        db.query(sql, myID, function (err, data, fields) {
            if (err) throw err;
            db.query(sql2, function (err, data2, fields) {
                return callback(data, data2);
            })
        });
    },
//éxécuter le formulaire d'ajout de clients
    executer_form_client: function (clientParam, callback) {
        var sql = 'INSERT INTO Clients SET ? ';
        db.query(sql, clientParam, function (err, data) {
            if (err) throw err;
            return callback(data);
        });
    },
//éxécuter le formulaire de modification des données clients
    update_form_client: function (clientParam, myID, callback) {
        var sql = 'UPDATE Clients SET ? WHERE clients_id = ?';
        db.query(sql, clientParam, myID, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    },
//supprimer les données clients 
    delete_fiche_client: function (myID, callback) {
        var sql = 'DELETE FROM Clients WHERE clients_id = ?'
        db.query(sql, myID, function (err, data, fields) {
            if (err) throw err;
            return callback(data);
        });
    }
}