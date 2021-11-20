var db = require('../config/database');
var modelStock = require('../models/modelStock');
module.exports = {
    afficher_liste_stocks: function (req, res) {
        modelStock.afficher_liste_stocks(function (data, data2, data3) {
            console.log(data2)
            console.log("--------------------------------")
            console.log(data3)
            lesStock = []
            for(i in data2){
                lesStock.push([data2[i].idMedicament, data2[i].Medicaments_libelle, data2[i].Medicaments_qte, data2[i].stock_necessaire])
            }
            for(i in data3){
                lesStock.push([data3[i].Medicaments_id, data3[i].Medicaments_libelle, data3[i].Medicaments_qte, 0])
            }
            console.log(lesStock)
            res.render('./liste_stocks', {lesStock, contenu: data, contenud: data2, titre: "Les stocks" })
        });
    },
    afficher_form_stock: function (req, res) {
        modelStock.afficher_form_stock(function (data) {
            res.render('./form_stock', { titre: "Formulaire stock" })
        });
    },
    afficher_fiche_stock: function (req, res) {
        let id = req.params.id;
        modelStock.afficher_fiche_stock(id, function (data) {
            console.log(data);
            res.render('./fiche_stock', { contenu: data, titre: "Fiche stock" })
        });
    },
    executer_form_stock: function (req, res) {
        let Medicaments_libelle = req.body.inputMed
        let Medicaments_qte = req.body.inputQte

        modelStock.executer_form_stock([Medicaments_libelle, Medicaments_qte], function (data) {
            res.redirect('./liste_stocks')
        })
    },
    update_form_stock: function (req, res) {
        let id = req.params.id
        let Medicaments_libelle = req.body.inputMed
        let Medicaments_qte = req.body.inputQte

        modelStock.update_form_stock([Medicaments_libelle, Medicaments_qte, id], function (data) {
            res.redirect('./../liste_stocks')
        })
    },



    delete_fiche_stock: function (req, res) {
        id = req.params.id
        modelStock.delete_fiche_stock(id, function (data) {
            console.log(data);
            res.redirect('./../liste_stocks')
        });
    }
}