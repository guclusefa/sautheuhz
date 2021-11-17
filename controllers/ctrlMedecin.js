var db = require('../config/database');
var modelMedecin = require('../models/modelMedecin');
module.exports = {
    afficher_liste_medecins: function (req, res) {
        modelMedecin.afficher_liste_medecins(function (data) {
            res.render('./liste_medecins', { contenu: data, titre: "Les médecins" });
        });
    },
    afficher_form_medecin: function (req, res) {
        modelMedecin.afficher_form_medecin(function (data) {
            res.render('./form_medecin', { contenu: data, titre: "Formulaire médecin" })
        });
    },
    afficher_fiche_medecin: function (req, res) {
        let id = req.params.id;
        modelMedecin.afficher_fiche_medecin(id, function (data) {
            console.log(data);
            res.render('./fiche_medecin', { contenu: data, titre: "Fiche médecin" })
        });
    },

    executer_form_medecin: function (req, res) {
        let Medecins_nom = req.body.inputNom
        let Medecins_prenom = req.body.inputPrenom
        let Medecins_mail = req.body.inputEmail
        let Medecins_tel = req.body.inputTel
        let Medecins_noOrdre = req.body.inputOrdre
        Medecins_tel = Medecins_tel.split(' ').join('')
        let medecinParam = { Medecins_noOrdre, Medecins_nom, Medecins_prenom, Medecins_tel, Medecins_mail }

        modelMedecin.executer_form_medecin(medecinParam, function (data) {
            console.log(data)
            res.redirect('./liste_medecins')
        })
    },
    update_form_medecin: function (req, res) {
        let id = req.params.id

        let Medecins_nom = req.body.inputNom
        let Medecins_prenom = req.body.inputPrenom
        let Medecins_mail = req.body.inputEmail
        let Medecins_tel = req.body.inputTel
        let Medecins_noOrdre = req.body.inputOrdre
        Medecins_tel = Medecins_tel.split(' ').join('')

        let medecinParam = { Medecins_noOrdre, Medecins_nom, Medecins_prenom, Medecins_tel, Medecins_mail }
        modelMedecin.update_form_medecin([medecinParam, id], function ( data) {
            console.log(data)
            res.redirect('./../liste_medecins')
        })
    },
    delete_fiche_medecin: function(req,res){
        id = req.params.id
        modelMedecin.delete_fiche_medecin(id, function (data) {
            console.log(data);
            res.redirect('./../liste_medecins')
        });
    }
}