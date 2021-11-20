var modelOrdonnance = require('../models/modelOrdonnance');
module.exports = {
    afficher_liste_ordonnances: function (req, res) {
        modelOrdonnance.afficher_liste_ordonnances(function (dataOrdo, dataDate, dataPrescription) {
            res.render('./liste_ordonnances', { valid: req.flash('valid'), erreur: req.flash('erreur'), contenu: dataOrdo, date: dataDate, prescriptions: dataPrescription, titre: "Les ordonnances" })
        });
    },
    afficher_form_ordonnance: function (req, res) {
        modelOrdonnance.afficher_form_ordonnance(function (dataClient, dataMedecin, dataPath, dataMedicament) {
            res.render('./form_ordonnance', { valid: req.flash('valid'), erreur: req.flash('erreur'), contenu: dataClient, medcontenu: dataMedecin, pathcontenu: dataPath, medicamentcontenu: dataMedicament, titre: "Formulaire ordonnance" })
        });
    },
    afficher_fiche_ordonnance: function (req, res) {
        let id = req.params.id;
        modelOrdonnance.afficher_fiche_ordonnance(id, function (dataClient, dataInfoOrdo, dataMedecin, dataPath, dataMedicament) {
            res.render('./fiche_ordonnance', { valid: req.flash('valid'), erreur: req.flash('erreur'), contenu: dataClient, info_ordo: dataInfoOrdo, medcontenu: dataMedecin, pathcontenu: dataPath, medicamentcontenu: dataMedicament, titre: "Formulaire ordonnance" })
        });
    },
    executer_form_ordonnance: function (req, res) {
        let idClient = req.body.selectClient
        let idMedecin = req.body.selectMedecin
        let idPath = req.body.selectPathologie
        let Ordonnances_date = req.body.inputDateDebut

        let erreurDate
        for (i in req.body.selectDateMed) {
            dateDebut = new Date(Ordonnances_date);
            dateFin = new Date(req.body.selectDateMed[i]);
            if (dateFin < dateDebut) {
                erreurDate = true
            }
        }

        if (idClient === "" || idMedecin === "" || idPath === "" || Ordonnances_date === "" || erreurDate) {
            if (erreurDate) {
                req.flash('erreur', 'Date de fin doit être supérieur a date de debut');

            } else {
                req.flash('erreur', 'Remplir tout les champs');

            }
            res.redirect('./form_ordonnance')
        } else {

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
                    modelOrdonnance.executer_form_ordonnance_prescription(prescriptionParam, function (data2) { })
                }

                req.flash('valid', "Ajout d'ordonnance terminé");
                res.redirect('./liste_ordonnances')
            })
        }
    },
    update_form_ordonnance: function (req, res) {
        let idOrdo = req.params.id

        let idClient = req.body.selectClient
        let idMedecin = req.body.selectMedecin
        let idPath = req.body.selectPathologie
        let Ordonnances_date = req.body.inputDateDebut

        let erreurDate2
        for (i in req.body.selectDateMed) {
            dateDebut = new Date(Ordonnances_date);
            dateFin = new Date(req.body.selectDateMed[i]);
            console.log(dateDebut + " " + dateFin)
            if (dateFin < dateDebut) {
               erreurDate2 = true
            }
        }

        if (idClient === "" || idMedecin === "" || idPath === "" || Ordonnances_date === "" || erreurDate2) {
            if (erreurDate2) {
                req.flash('erreur', 'Date de fin doit être supérieur a date de debut');
            } else {
                req.flash('erreur', 'Remplir tout les champs');

            }
            res.redirect('../fiche_ordonnance/'+idOrdo)
        } else {
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
                    req.flash('valid', `Modification d'ordonnance terminé`);
                    res.redirect('./../liste_ordonnances')
                })
            })
        }
    },
    delete_fiche_ordonnance: function (req, res) {
        id = req.params.id
        modelOrdonnance.delete_fiche_ordonnance(id, function (data) {
            console.log(data);
            req.flash('valid', `Supression d'ordonnance terminé`);
            res.redirect('./../liste_ordonnances')
        });
    }

}