var db = require('../config/database');
var modelOrdonnance = require('../models/modelOrdonnance');
module.exports = {
    afficher_liste_ordonnances: function (req, res) {
        modelOrdonnance.afficher_liste_ordonnances(function (dataOrdo, dataDate, dataPrescription) {
            res.render('./liste_ordonnances', { contenu: dataOrdo, date: dataDate, prescriptions: dataPrescription, titre: "Les ordonnances" })
        });
    },
    afficher_form_ordonnance: function (req, res) {
        modelOrdonnance.afficher_form_ordonnance(function (dataClient, dataMedecin, dataPath, dataMedicament) {
            res.render('./form_ordonnance', { contenu: dataClient, medcontenu: dataMedecin, pathcontenu: dataPath, medicamentcontenu: dataMedicament, titre: "Formulaire ordonnance" })
        });
    },
    afficher_fiche_ordonnance: function (req, res) {
        let id = req.params.id;
        modelOrdonnance.afficher_fiche_ordonnance(id, function (dataClient, dataInfoOrdo, dataMedecin, dataPath, dataMedicament) {
            res.render('./fiche_ordonnance', { contenu: dataClient, info_ordo: dataInfoOrdo, medcontenu: dataMedecin, pathcontenu: dataPath, medicamentcontenu: dataMedicament, titre: "Formulaire ordonnance" })
        });
    },
    executer_form_ordonnance: function (req, res) {
        let idClient = req.body.selectClient
        let idMedecin = req.body.selectMedecin
        let idPath = req.body.selectPathologie
        let Ordonnances_date = req.body.inputDateDebut

        Ordonnances_date = Ordonnances_date.split("/").reverse().join("/");
        ordonnanceParam = { idPath, idMedecin, idClient, Ordonnances_date }

        modelOrdonnance.executer_form_ordonnance(ordonnanceParam, function (data2) {
            data2 = JSON.parse(JSON.stringify(data2))
            idOrdo = data2[0].Ordonnances_id
            console.log(idOrdo)

            for (i in req.body.selectMedicament) {
                idMedicament = req.body.selectMedicament[i]
                Prescriptions_quantite = req.body.selectQte[i]
                Prescriptions_frequence = req.body.inputFrequence[i]
                Prescriptions_dateFin = req.body.selectDateMed[i]

                prescriptionParam = { idOrdo, idMedicament, Prescriptions_quantite, Prescriptions_frequence, Prescriptions_dateFin }
                modelOrdonnance.executer_form_ordonnance_prescription(prescriptionParam, function (data2) {
                })
            }
            res.redirect('./liste_ordonnances')
        })
    },
    update_form_ordonnance: function (req, res) {
        let idOrdo = req.params.id

        let idClient = req.body.selectClient
        let idMedecin = req.body.selectMedecin
        let idPath = req.body.selectPathologie
        let Ordonnances_date = req.body.inputDateDebut
        Ordonnances_date = Ordonnances_date.split("/").reverse().join("/");

        let ordonnanceParam = { idPath, idMedecin, idClient, Ordonnances_date }

        modelOrdonnance.update_form_ordonnance([ordonnanceParam, idOrdo], function (data) {
            modelOrdonnance.update_form_ordonnance_delete(idOrdo, function (data) {

                for (i in req.body.selectMedicament) {
                    idMedicament = req.body.selectMedicament[i]
                    Prescriptions_quantite = req.body.selectQte[i]
                    Prescriptions_frequence = req.body.inputFrequence[i]
                    Prescriptions_dateFin = req.body.selectDateMed[i]
                   
                    prescriptionParam = { idOrdo, idMedicament, Prescriptions_quantite, Prescriptions_frequence, Prescriptions_dateFin }
                    modelOrdonnance.executer_form_ordonnance_prescription(prescriptionParam, function (data2) {
                    })
                }
                res.redirect('.././liste_ordonnances')

            })
        })






    },













    delete_fiche_ordonnance: function (req, res) {
        id = req.params.id
        modelOrdonnance.delete_fiche_ordonnance(id, function (data) {
            console.log(data);
            res.redirect('./../liste_ordonnances')
        });
    }

}