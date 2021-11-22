/*
Le model permet en autre d'écrire les requetes sql des différentes fonctions.
Le model Mutuelle permet de stocker les différentes requête concernant les Mutuelle, à savoir : 
    -afficher la liste des Mutuelle avec leurs données
    -afficher le formulaire d'ajout de Mutuelle 
    -afficher une fiche individuelle sous forme de formulaire pour chaque Mutuelle, permettant également de modifier les données
    -éxécuter le formulaire d'ajout de Mutuelle
    -éxécuter le formulaire de modification des données Mutuelle
    -supprimer les données Mutuelle 
*/

var db = require('../config/database');
module.exports= {
//afficher la liste des Mutuelle avec leurs données
    afficher_liste_mutuelles:function(callback){
        var sql = 'SELECT * FROM Mutuelles'
        db.query(sql, function(err,data,fields){
            if (err)throw err;
            return callback(data);
        });
    }, 
//afficher le formulaire d'ajout de Mutuelle 
    afficher_form_mutuelle: function(callback){
        return callback();
    },
//afficher une fiche individuelle sous forme de formulaire pour chaque Mutuelle, permettant également de modifier les données
    afficher_fiche_mutuelle: function(myID,callback){
        var sql = 'SELECT * FROM Mutuelles WHERE Mutuelles_id =?'
        db.query(sql, myID, function(err,data,fields){
            if(err)throw err;
            return callback(data);
        });
    },
//éxécuter le formulaire d'ajout de Mutuelle
    executer_form_mutuelle: function(Mutuelles_nom,Mutuelles_tel, Mutuelles_mail, callback){
        var sql= 'INSERT INTO Mutuelles SET ? ' ;
        db.query(sql,Mutuelles_nom, Mutuelles_tel, Mutuelles_mail, function(err, data){
            if(err)throw err;
            return callback(data);
        });
    },
//éxécuter le formulaire de modification des données Mutuelle
    update_form_mutuelle: function(medecinParam,myID, callback){
        var sql = 'UPDATE Mutuelles SET  ? WHERE Mutuelles_id = ?' ;
        db.query(sql, medecinParam, myID, function(err, data,fields){
            if(err)throw err;
            return callback(data);
        });
    },
//supprimer les données Mutuelle 
    delete_fiche_mutuelle:function(myID, callback){
        var sql = 'DELETE FROM Mutuelles WHERE Mutuelles_id = ?'
        db.query(sql, myID, function(err,data,fields){
            if(err)throw err;
            return callback(data);
        });
    }




}



