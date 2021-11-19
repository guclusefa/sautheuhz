var db = require('../config/database');
var modelMutuelle = require('../models/modelMutuelle');

module.exports = {
    afficher_liste_mutuelles: function (req, res) {
        modelMutuelle.afficher_liste_mutuelles(function (data) {
            res.render('./liste_mutuelles', { contenu: data, titre: "Les mutuelles" });
        });
    },
    afficher_form_mutuelle: function (req, res) {
        modelMutuelle.afficher_form_mutuelle(function (data) {
            res.render('./form_mutuelle', { titre: "Formulaire mutuelle" });
        });
    },
    afficher_fiche_mutuelle: function (req, res) {
        let id = req.params.id;
        modelMutuelle.afficher_fiche_mutuelle(id, function (data) {
            console.log(data);
            res.render('./fiche_mutuelle', { contenu: data, titre: "Fiche mutuelle" })
        });
    },
    executer_form_mutuelle: function (req, res) {
        let Mutuelles_nom = req.body.inputNomMutu
        let Mutuelles_mail = req.body.inputEmail
        let Mutuelles_tel = req.body.inputTel
        Mutuelles_tel = Mutuelles_tel.split(' ').join('')

        let mutuelleParam = {Mutuelles_nom, Mutuelles_tel, Mutuelles_mail }

        modelMutuelle.executer_form_mutuelle(mutuelleParam, function (data) {
            console.log(data)
            res.redirect('./liste_mutuelles')
        })
    },
    update_form_mutuelle:function (req, res) {
        let id = req.params.id
        let Mutuelles_nom = req.body.inputNomMutu
        let Mutuelles_mail = req.body.inputEmail
        let Mutuelles_tel = req.body.inputTel
        Mutuelles_tel = Mutuelles_tel.split(' ').join('')

        let mutuelleParam = {Mutuelles_nom, Mutuelles_tel, Mutuelles_mail }

        modelMutuelle.update_form_mutuelle([mutuelleParam, id], function (data) {
            console.log(data)
            res.redirect('./../liste_mutuelles')
        })
    },
    delete_fiche_mutuelle: function(req,res){
        id = req.params.id
        modelMutuelle.delete_fiche_mutuelle(id, function (data) {
            console.log(data);
            res.redirect('./../liste_mutuelles')
        });
    }

}