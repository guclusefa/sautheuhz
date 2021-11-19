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
    /*executer_form_stock: function (req, res) {
        let Medicaments_libelle = req.body.inputMed
        let Stocks_quantite = req.body.inputQte
        sqlParam1 ={Medicaments_libelle}

        modelStock.executer_form_stock(sqlParam1, function(medicamentId){
            medicamentId = JSON.parse(JSON.stringify(medicamentId))
            let idMedicament = medicamentId[0].Medicaments_id
            slqParam2 = {idMedicament, Stocks_quantite }

            let idOrdo= 73
            let Prescriptions_quantite = 0 
            let Prescriptions_frequence = 0 
            let Prescriptions_dateFin ='2099-11-01'

            modelStock.executer_form_stock_suite(slqParam2, function(data){

                modelStock.executer_form_stock_suite2(idMedicament, function(idMedicament){

                })

            })
            res.redirect('./liste_stocks')

        })

    },*/
    update_form_stock: function (req, res) {
        let id = req.params.id
         let Medicaments_libelle = req.body.inputMed
         let Stocks_quantite = req.body.inputQte
        let Medicaments_id = id
         sql1Param = {Medicaments_libelle}

         modelStock.update_form_stock([sql1Param, Medicaments_id], function (data) {
            let idMedicament =id
            sql2Param= {Stocks_quantite}

            modelStock.update_form_stock2([sql2Param, idMedicament], function (data) {
        
                res.redirect('./../liste_stocks')

            })
            
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