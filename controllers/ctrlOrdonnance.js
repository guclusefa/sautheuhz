/*
Le controller permet d'excuter une fonction au moment voulu, c'est ici que l'on execute les requetes sql.
Le controller Ordonnance permet d'executer les fonctions et requetes Ordonnances, à savoir : 
    -afficher la liste des Ordonnances avec leurs données
    -afficher le formulaire d'ajout de Ordonnances en recupérant les données déja présentes dans la base (liste clients/medecins/pathologies/medicaments)
    -afficher une fiche individuelle sous forme de formulaire pour chaque Ordonnance, permettant également de modifier les données
    -éxécuter le formulaire d'ajout de Ordonnances
    -éxécuter le formulaire de modification des données Ordonnances
    -supprimer les données Ordonnances 
*/

var modelOrdonnance = require('../models/modelOrdonnance');
module.exports = {
//afficher la liste des Ordonnances avec leurs données
    afficher_liste_ordonnances: function (req, res) {
        modelOrdonnance.afficher_liste_ordonnances(function (dataOrdo, dataDate, dataPrescription) {
            res.render('./liste_ordonnances', { valid: req.flash('valid'), erreur: req.flash('erreur'), contenu: dataOrdo, date: dataDate, prescriptions: dataPrescription, titre: "Les ordonnances" })
        });
    },
//afficher le formulaire d'ajout de Ordonnances en recupérant les données déja présentes dans la base (liste clients/medecins/pathologies/medicaments)
    afficher_form_ordonnance: function (req, res) {
        modelOrdonnance.afficher_form_ordonnance(function (dataOrdonnance, dataMedecin, dataPath, dataMedicament) {
            res.render('./form_ordonnance', { valid: req.flash('valid'), erreur: req.flash('erreur'), contenu: dataOrdonnance, medcontenu: dataMedecin, pathcontenu: dataPath, medicamentcontenu: dataMedicament, titre: "Formulaire ordonnance" })
        });
    },
//afficher une fiche individuelle sous forme de formulaire pour chaque Ordonnance, permettant également de modifier les données
    afficher_fiche_ordonnance: function (req, res) {
        //recup l'id de l'objet cliqué        
        let id = req.params.id;
        modelOrdonnance.afficher_fiche_ordonnance(id, function (dataOrdonnance, dataInfoOrdo, dataMedecin, dataPath, dataMedicament) {
            res.render('./fiche_ordonnance', { valid: req.flash('valid'), erreur: req.flash('erreur'), contenu: dataOrdonnance, info_ordo: dataInfoOrdo, medcontenu: dataMedecin, pathcontenu: dataPath, medicamentcontenu: dataMedicament, titre: "Formulaire ordonnance" })
        });
    },
//éxécuter le formulaire d'ajout de Ordonnances
    executer_form_ordonnance: function (req, res) {
        //récupération des différentes entrées client dans le formulaire 
        let idOrdonnance = req.body.selectOrdonnance
        let idMedecin = req.body.selectMedecin
        let idPath = req.body.selectPathologie
        let Ordonnances_date = req.body.inputDateDebut
        
        ///verifie si la date de fin de prescription entrée par l'utilisateur n'est pas anterieur à la date de début d'ordonnances
        let erreurDate
        for (i in req.body.selectDateMed) {
            dateDebut = new Date(Ordonnances_date);
            dateFin = new Date(req.body.selectDateMed[i]);
            if (dateFin < dateDebut) {
                erreurDate = true
            }
        }
        //verifie si les champs ne sont pas vides, sinon renvoie un message d'erreur
        if (idOrdonnance === "" || idMedecin === "" || idPath === "" || Ordonnances_date === "" || erreurDate) {
            if (erreurDate) {
                req.flash('erreur', 'Date de fin doit être supérieur a date de debut');

            } else {
                req.flash('erreur', 'Remplir tout les champs');

            }
            res.redirect('./form_ordonnance')
        } else {
            //reverse la date de naissance pour la mettre au format mysql
            Ordonnances_date = Ordonnances_date.split("/").reverse().join("/");
            //prepare la variable a passé dans la requete sql pour insert            
            ordonnanceParam = { idPath, idMedecin, idOrdonnance, Ordonnances_date }
            //execution de la requete sql se trouvant dans le modelOrdonnance
            modelOrdonnance.executer_form_ordonnance(ordonnanceParam, function (data2) {
                //parse les données récuperer par les premieres requetes pour en extraire le numéro d'ordonnances créé afin de savoir ou insert les prescriptions
                data2 = JSON.parse(JSON.stringify(data2))
                idOrdo = data2[0].Ordonnances_id
                console.log(idOrdo)
                
                for (i in req.body.selectMedicament) {
                //récupération des différentes entrées client dans les prescriptions
                    idMedicament = req.body.selectMedicament[i]
                    Prescriptions_quantite = req.body.selectQte[i]
                    Prescriptions_frequence = req.body.inputFrequence[i]
                    Prescriptions_dateFin = req.body.selectDateMed[i]
                    //prepare la variable a passé dans la requete sql pour insert les prescriprions          
                    prescriptionParam = { idOrdo, idMedicament, Prescriptions_quantite, Prescriptions_frequence, Prescriptions_dateFin }
                    modelOrdonnance.executer_form_ordonnance_prescription(prescriptionParam, function (data2) { })
                }

                req.flash('valid', "Ajout d'ordonnance terminé");
                res.redirect('./liste_ordonnances')
            })
        }
    },
//éxécuter le formulaire de modification des données Ordonnances
    update_form_ordonnance: function (req, res) {
        //recup l'id de l'objet cliqué
        let idOrdo = req.params.id
        //récupération des différentes entrées client dans le formulaire 
        //si non modifiés il s'agit des données client contenu dans la BDD
        let idOrdonnance = req.body.selectOrdonnance
        let idMedecin = req.body.selectMedecin
        let idPath = req.body.selectPathologie
        let Ordonnances_date = req.body.inputDateDebut

        //verifie si la date de fin de prescription entrée par l'utilisateur n'est pas anterieur à la date de début d'ordonnances
        let erreurDate2
        for (i in req.body.selectDateMed) {
            dateDebut = new Date(Ordonnances_date);
            dateFin = new Date(req.body.selectDateMed[i]);
            console.log(dateDebut + " " + dateFin)
            if (dateFin < dateDebut) {
               erreurDate2 = true
            }
        }
        //verifie si les champs ne sont pas vides, sinon renvoie un message d'erreur
        if (idOrdonnance === "" || idMedecin === "" || idPath === "" || Ordonnances_date === "" || erreurDate2) {
            if (erreurDate2) {
                req.flash('erreur', 'Date de fin doit être supérieur a date de debut');
            } else {
                req.flash('erreur', 'Remplir tout les champs');

            }
            res.redirect('../fiche_ordonnance/'+idOrdo)
        } else {
            //reverse la date de naissance pour la mettre au format mysql
            Ordonnances_date = Ordonnances_date.split("/").reverse().join("/");
            let ordonnanceParam = { idPath, idMedecin, idOrdonnance, Ordonnances_date }

            modelOrdonnance.update_form_ordonnance([ordonnanceParam, idOrdo], function (data) {
                modelOrdonnance.update_form_ordonnance_delete(idOrdo, function (data) {

                    for (i in req.body.selectMedicament) {
                    //récupération des différentes entrées client dans les prescriptions
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
//supprimer les données Ordonnances 
    delete_fiche_ordonnance: function (req, res) {
        //recup l'id de l'objet cliqué
        id = req.params.id
        modelOrdonnance.delete_fiche_ordonnance(id, function (data) {
            console.log(data);
            req.flash('valid', `Supression d'ordonnance terminé`);
            res.redirect('./../liste_ordonnances')
        });
    }

}