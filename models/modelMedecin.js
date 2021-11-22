/*
Le model permet en autre d'écrire les requetes sql des différentes fonctions.
Le model Ordonnance permet de stocker les différentes requête concernant les Medecins, à savoir : 
    -afficher la liste des Medecines avec leurs données
    -afficher le formulaire d'ajout de Medecins
    -afficher une fiche individuelle sous forme de formulaire pour chaque Medecin, permettant également de modifier les données
    -éxécuter le formulaire d'ajout de Medecin
    -éxécuter le formulaire de modification des données Medecins
    -supprimer les données sur un medecin 
*/
var db = require('../config/database');
module.exports= {
//afficher la liste des Medecines avec leurs données
    afficher_liste_medecins:function(callback){
        var sql ='SELECT * FROM Medecins';
        db.query(sql, function(err,data,fields){
            if (err)throw err;
            return callback(data);
        });
    },
//afficher le formulaire d'ajout de Medecins
    afficher_form_medecin: function(callback){
        return callback();
    },
//afficher une fiche individuelle sous forme de formulaire pour chaque Medecin, permettant également de modifier les données
    afficher_fiche_medecin: function(myID, callback){
        var sql = 'SELECT * FROM Medecins WHERE Medecins_id = ?' ;
        db.query(sql, myID, function(err,data,fields){
            if(err)throw err;
            return callback(data);
        });
    },
//éxécuter le formulaire d'ajout de Medecin
    executer_form_medecin: function(medecinOrdreNo,medecinNom, medecinPrenom, medecinTel, MedecinMail, callback){
        var sql= 'INSERT INTO Medecins SET ? ' ;
        db.query(sql,medecinOrdreNo, medecinNom, medecinPrenom,medecinTel, MedecinMail, function(err, data){
            if(err)throw err;
            return callback(data);
        });
    },
//éxécuter le formulaire de modification des données Medecins
    update_form_medecin: function(medecinParam,myID, callback){
        var sql = 'UPDATE Medecins SET ? WHERE Medecins_id = ?' ;
        db.query(sql, medecinParam, myID, function(err, data,fields){
            if(err)throw err;
            return callback(data);
        });
    },
//supprimer les données sur un medecin 
    delete_fiche_medecin: function(myID, callback){
        var sql = 'DELETE FROM Medecins WHERE Medecins_id = ?'
        db.query(sql, myID, function(err,data,fields){
            if(err)throw err;
            return callback(data);
        });
    }

}