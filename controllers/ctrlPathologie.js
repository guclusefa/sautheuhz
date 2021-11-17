var db = require('../config/database');
var modelPathologie = require('../models/modelPathologie');
module.exports = {
    afficher_liste_pathologies: function (req, res) {
        modelPathologie.afficher_liste_pathologies(function (data) {
            res.render('./liste_pathologies', { contenu: data, titre: "Les pathologies" })
        });
    },
    afficher_form_pathologie: function (req, res) {
        modelPathologie.afficher_form_pathologie(function (data) {
            res.render('./form_pathologie', { contenu: data, titre: "Formulaire pathologie" })
        });
    },
    afficher_fiche_pathologie: function (req, res) {
        let id = req.params.id;
        modelPathologie.afficher_fiche_pathologie(id, function (data) {
            console.log(data);
            res.render('./fiche_pathologie', { contenu: data, titre: "Fiche pathologie" })
        });
    },
    executer_form_pathologie: function (req, res) {
        let Pathologies_libelle = req.body.inputNomMutu
        pathoLib={Pathologies_libelle}
        modelPathologie.executer_form_pathologie(pathoLib, function (data) {
            console.log(data)
            res.redirect('./liste_pathologies')
        })
    },
    update_form_pathologie: function (req, res) {
        let id = req.params.id
        let Pathologies_libelle = req.body.inputNomMutu
        let pathoLib= {Pathologies_libelle}
        modelPathologie.update_form_pathologie([pathoLib, id], function ( data) {
            console.log(data)
            res.redirect('./../liste_pathologies')
        })
    },
    delete_fiche_pathologie: function(req,res){
        id = req.params.id
        modelPathologie.delete_fiche_pathologie(id, function (data) {
            console.log(data);
            res.redirect('./../liste_pathologies')
        });
    }
}