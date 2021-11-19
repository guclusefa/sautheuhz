var db = require('../config/database');
var modelStock = require('../models/modelStock');
module.exports = {
    afficher_liste_stocks: function (req, res) {
        modelStock.afficher_liste_stocks(function (data,data2) {
            res.render('./liste_stocks', { contenu: data, contenud: data2, titre: "Les stocks" })
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
        

    },
}