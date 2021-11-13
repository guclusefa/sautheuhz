// inclure les dépendances et middlewares
const mysql = require('mysql')
const express = require('express')
const iniparser = require('iniparser')

// activer les dépendances
let app = express()
app.set('view engine', 'ejs')
app.use(express.static('assets'))
app.use(express.static('views'))

// connexion mysql
let configDB = iniparser.parseSync('config/DB.ini')
let mysqlconnexion = mysql.createConnection({
    host: configDB['dev']['host'],
    user: configDB['dev']['user'],
    password: configDB['dev']['password'],
    database: configDB['dev']['dbname']
})
// afficher page
const afficher_accueil = (req, res) => {
    res.render('./accueil', { titre: "Accueil" })
}

const afficher_connexion = (req, res) => {
    res.render('./connexion', { titre: "Connexion" })
}

// les listes
const afficher_liste_clients = (req, res) => {
    mysqlconnexion.query('SELECT clients_id, idMutuelle, clients_noSS, clients_nom, clients_prenom, clients_sexe, DATE_FORMAT(clients_dateNaissance, "%d/%m/%Y") as clients_dateNaissance, clients_tel, clients_mail, clients_adresse, clients_ville , clients_cp, idMutuelle, Mutuelles_id, Mutuelles_Nom FROM Clients, Mutuelles WHERE idMutuelle = Mutuelles_id', (err, lignes, champs) => {
        if (!err) {
            console.log(lignes)
            res.render('./liste_clients', { contenu: lignes, titre: "Liste des clients" })
        }
    })
}

const afficher_liste_ordonnances = (req, res) => {
    mysqlconnexion.query('SELECT * FROM Ordonnances WHERE Ordonnances_id', (err, contenuordo, champs) => {
        if (!err) {

            mysqlconnexion.query('SELECT DATE_FORMAT(Ordonnances_date, "%d/%m/%Y") as dateOrdo, idOrdo, max(Prescriptions_dateFin - Ordonnances_date) as dureeOrdonnance, clients_nom, clients_prenom, Medecins_nom, Medecins_prenom, Pathologies_libelle FROM Pathologies, Medecins, Clients, Ordonnances, Prescriptions WHERE idPath = Pathologies_id AND idOrdo = Ordonnances_id AND clients_id = idClient AND idMedecin = Medecins_id GROUP BY idOrdo ORDER BY dureeOrdonnance DESC ', (err, contenudate, champs) => {
                if (!err) {
                    mysqlconnexion.query('SELECT *, Prescriptions_dateFin - Ordonnances_date as duree, DATE_FORMAT(Prescriptions_dateFin, "%d/%m/%Y") as dateFin FROM Prescriptions, Medicaments, Ordonnances WHERE idMedicament = Medicaments_id AND idOrdo = Ordonnances_id', (err, contenupresciptions, champs) => {
                        if (!err) {
                            console.log(contenudate)
                            res.render('./liste_ordonnances', { prescriptions: contenupresciptions, contenu: contenuordo, date: contenudate, titre: "Les ordonnances" })
                        }
                    })
                }
            })
        }
    })


}

const afficher_liste_stocks = (req, res) => {
    mysqlconnexion.query('SELECT * FROM Stocks, Medicaments WHERE Medicaments_id = idMedicament ', (err, lignes, champs) => {
        if (!err) {
            console.log(lignes)

            mysqlconnexion.query('SELECT idMedicament, SUM(Prescriptions_quantite*Prescriptions_frequence*(Prescriptions_dateFin - Ordonnances_date)) as stock_necessaire FROM Prescriptions, Ordonnances WHERE idOrdo = Ordonnances_id AND Prescriptions_dateFin >= NOW() GROUP BY idMedicament ', (err, lignesd, champs) => {
                if (!err) {
                    console.log(lignesd)
                    res.render('./liste_stocks', { contenu: lignes, contenud: lignesd, titre: "Les stocks" })
                }
            })

        }
    })
}



// les forumalires
const afficher_form_client = (req, res) => {

    mysqlconnexion.query('SELECT Mutuelles_nom, Mutuelles_id FROM Mutuelles', (err, lignes, champs) => {
        if (!err) {
            res.render('./form_client', { contenu: lignes, titre: "Formulaire client" })
        }
    })


}

const afficher_form_ordonnance = (req, res) => {
    mysqlconnexion.query('SELECT clients_id, clients_nom, clients_prenom FROM Clients', (err, lignes, champs) => {
        if (!err) {
            mysqlconnexion.query('SELECT Medecins_id, Medecins_nom, Medecins_prenom FROM Medecins', (err, medlignes, champs) => {
                if (!err) {
                    mysqlconnexion.query('SELECT Pathologies_id, Pathologies_libelle FROM Pathologies', (err, pathlignes, champs) => {
                        if (!err) {

                            mysqlconnexion.query('SELECT Medicaments_id, Medicaments_libelle FROM Medicaments', (err, medicamentlignes, champs) => {
                                if (!err) {
                                    res.render('./form_ordonnance', { contenu: lignes, medcontenu: medlignes, pathcontenu: pathlignes, medicamentcontenu: medicamentlignes, titre: "Formulaire ordonnance" })
                                }
                            })

                        }
                    })

                }
            })
        }
    })



}

const afficher_form_stock = (req, res) => {
    res.render('./form_stock', { titre: "Formulaire stock" })
}

const afficher_fiche_client = (req, res) => {
    id = req.params.id
    mysqlconnexion.query('SELECT *, DATE_FORMAT(clients_dateNaissance, "%Y-%m-%d") as dateN FROM Clients WHERE clients_id =' + id, (err, info_client, champs) => {
        mysqlconnexion.query('SELECT Mutuelles_nom, Mutuelles_id FROM Mutuelles', (err, lignes, champs) => {
            if (!err) {
                res.render('./fiche_client', { info_client: info_client, contenu: lignes, titre: "Fiche client" })
            }
        })
    })
}

const afficher_fiche_ordonnance = (req, res) => {
    id = req.params.id
    mysqlconnexion.query('SELECT clients_id, clients_nom, clients_prenom FROM Clients', (err, lignes, champs) => {
        if (!err) {
            mysqlconnexion.query('SELECT *, DATE_FORMAT(Ordonnances_date, "%Y-%m-%d") as dateOrdo, DATE_FORMAT(Prescriptions_dateFin, "%Y-%m-%d") as datePresc FROM Ordonnances, Prescriptions WHERE idOrdo = Ordonnances_id AND idOrdo =' + id, (err, info_ordo, champs) => {
                if (!err) {
                    mysqlconnexion.query('SELECT Medecins_id, Medecins_nom, Medecins_prenom FROM Medecins', (err, medlignes, champs) => {
                        if (!err) {
                            mysqlconnexion.query('SELECT Pathologies_id, Pathologies_libelle FROM Pathologies', (err, pathlignes, champs) => {
                                if (!err) {
                                    mysqlconnexion.query('SELECT Medicaments_id, Medicaments_libelle FROM Medicaments', (err, medicamentlignes, champs) => {
                                        if (!err) {
                                            console.log(info_ordo)
                                            res.render('./fiche_ordonnance', { contenu: lignes, info_ordo: info_ordo, medcontenu: medlignes, pathcontenu: pathlignes, medicamentcontenu: medicamentlignes, titre: "Formulaire ordonnance" })
                                        }
                                    })

                                }
                            })

                        }
                    })
                }
            })
        }
    })
}

// afficher vue même nom que directory -> test
const afficher_dir = (req, res) => {
    res.render('./' + req.params.dir)
}



const executer_form_ordonnance = (req, res) => {

    let ordonnanceClient = req.body.selectClient
    let ordonnanceMedecin = req.body.selectMedecin
    let ordonnancePathologie = req.body.selectPathologie
    let ordonnanceDateDebut = req.body.inputDateDebut

    ordonnanceDateDebut = ordonnanceDateDebut.split("/").reverse().join("/");
    //prescriptionDateFin = prescriptionDateFin.split("/").reverse().join("/");

    let requeteSQL = "INSERT INTO Ordonnances (idPath, idMedecin, idClient, Ordonnances_date) VALUES"
    requeteSQL += ` (${ordonnancePathologie},'${ordonnanceMedecin}','${ordonnanceClient}','${ordonnanceDateDebut}')`
    mysqlconnexion.query(requeteSQL, (err, lignes, champs) => {
        if (!err) {
            console.log("Insertion terminé");

            let requeteSQL2 = 'SELECT Ordonnances_id FROM Ordonnances ORDER BY Ordonnances_id DESC'
            mysqlconnexion.query(requeteSQL2, (err, idOrdo, champs) => {
                if (!err) {
                    idOrdo = JSON.parse(JSON.stringify(idOrdo))
                    id = idOrdo[0].Ordonnances_id

                    for (i in req.body.selectMedicament) {
                        prescriptionMedicament = req.body.selectMedicament[i]
                        prescriptionQuantite = req.body.selectQte[i]
                        prescriptionFrequence = req.body.inputFrequence[i]
                        prescriptionDateFin = req.body.selectDateMed[i]

                        let requeteSQL3 = "INSERT INTO Prescriptions (idOrdo, idMedicament, Prescriptions_quantite, Prescriptions_frequence, Prescriptions_dateFin) VALUES"
                        requeteSQL3 += ` (${id},${prescriptionMedicament},${prescriptionQuantite},${prescriptionFrequence},'${prescriptionDateFin}')`
                        console.log(requeteSQL)
                        console.log(requeteSQL3)

                        mysqlconnexion.query(requeteSQL3, (err, lignes, champs) => {
                            if (!err) {
                                console.log("Insertion terminé");
                            } else {
                                console.log("Erreur lors de l'enregistrement")
                            }
                        })
                    }
                    res.redirect('./liste_ordonnances')
                } else {
                    console.log("Erreur lors de l'enregistrement")
                    res.send("Erreur ajout : " + JSON.stringify(err))
                }
            })
        } else {
            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })
}

const executer_form_client = (req, res) => {

    let clientNom = req.body.inputNom
    let clientPrenom = req.body.inputPrenom
    let clientMail = req.body.inputEmail
    let clientTel = req.body.inputTel
    let clientSexe = req.body.selectSexe
    let clientBirthday = req.body.inputDate
    let clientAdresse = req.body.inputAdresse
    let clientVille = req.body.inputVille
    let clientCp = req.body.inputCp
    let clientNoSS = req.body.inputSS
    let clientMutuelle = req.body.selectMutuelle
    //reverse la date de naissance pour la mettre au format mysql
    clientBirthday = clientBirthday.split("/").reverse().join("/");

    clientTel = clientTel.split(' ').join('')
    clientNoSS = clientNoSS.split(' ').join('')


    let requeteSQL = "INSERT INTO Clients (idMutuelle, clients_noSS, clients_nom, clients_prenom, clients_sexe, clients_dateNaissance, clients_tel, clients_mail, clients_adresse, clients_ville, clients_cp) VALUES"
    requeteSQL += ` (${clientMutuelle},'${clientNoSS}','${clientNom}','${clientPrenom}' , '${clientSexe}' ,'${clientBirthday}', ${clientTel},'${clientMail}', '${clientAdresse}', '${clientVille}', '${clientCp}')`

    mysqlconnexion.query(requeteSQL, (err, lignes, champs) => {
        if (!err) {
            console.log("Insertion terminé");
            res.redirect('./liste_clients')
        } else {
            console.log("Insertion echouée");

            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })

}

//ajouter un medicament 

const executer_form_stock = (req,res) => {
    let medicamentNom = req.body.inputMed
    let medicamentQuantite= req.body.inputQte

    let requeteSQL = `INSERT INTO Medicaments (Medicaments_libelle) VALUES ('${medicamentNom}') `
    mysqlconnexion.query(requeteSQL, (err, lignes, champs) => {
        if (!err) {
            console.log("insertion  terminé");

            let requeteSQL2 = 'SELECT Medicaments_id FROM Medicaments ORDER BY Medicaments_id DESC'
            mysqlconnexion.query(requeteSQL2, (err, idmed, champs) => {
                if (!err) {
                    idmed = JSON.parse(JSON.stringify(idmed))
                    idm = idmed[0].Medicaments_id
                    console.log(idm)
                    console.log("insertion  terminé");

                    let requeteSQL3 = `INSERT INTO Stocks (idMedicament, Stocks_quantite) VALUES (${idm}, ${medicamentQuantite})`
                    mysqlconnexion.query(requeteSQL3, (err, champs) => {
                        if (!err) {
                            console.log("insertion  terminé");
                            
                            res.redirect('./form_ordonnance')
                        } else {
                
                            console.log("Erreur lors de l'enregistrment")
                            res.send("Erreur ajout : " + JSON.stringify(err))
                        }
                    })
                } else {
        
                    console.log("Erreur lors de l'enregistrment")
                    res.send("Erreur ajout : " + JSON.stringify(err))
                }
            })



            
        } else {

            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })
}

const update_form_client = (req, res) => {
    id = req.params.id


    let clientNom = req.body.inputNom
    let clientPrenom = req.body.inputPrenom
    let clientMail = req.body.inputEmail
    let clientTel = req.body.inputTel
    let clientSexe = req.body.selectSexe
    let clientBirthday = req.body.inputDate
    let clientAdresse = req.body.inputAdresse
    let clientVille = req.body.inputVille
    let clientCp = req.body.inputCp
    let clientNoSS = req.body.inputSS
    let clientMutuelle = req.body.selectMutuelle

    //reverse la date de naissance pour la mettre au format mysql
    clientBirthday = clientBirthday.split("/").reverse().join("/");

    clientTel = clientTel.split(' ').join('')
    clientNoSS = clientNoSS.split(' ').join('')

    let requeteSQL = `UPDATE Clients SET idMutuelle = ${clientMutuelle} , clients_noSS ='${clientNoSS}' , clients_nom = '${clientNom}', clients_prenom = '${clientPrenom}', clients_sexe = '${clientSexe}', clients_dateNaissance = '${clientBirthday}', clients_tel = ${clientTel}, clients_mail = '${clientMail}', clients_adresse = '${clientAdresse}', clients_ville = '${clientVille}', clients_cp = '${clientCp}' WHERE clients_id = ` + id


    mysqlconnexion.query(requeteSQL, (err, lignes, champs) => {
        if (!err) {
            console.log("Insertion terminé");
            res.redirect('./../liste_clients')
        } else {
            console.log("Insertion echouée");

            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })

}

const update_form_ordonnance = (req, res) => {
    let id = req.params.id

    let ordonnanceClient = req.body.selectClient
    let ordonnanceMedecin = req.body.selectMedecin
    let ordonnancePathologie = req.body.selectPathologie
    let ordonnanceDateDebut = req.body.inputDateDebut

    ordonnanceDateDebut = ordonnanceDateDebut.split("/").reverse().join("/");
    //prescriptionDateFin = prescriptionDateFin.split("/").reverse().join("/");

    let requeteSQL = `UPDATE Ordonnances SET idPath = ${ordonnancePathologie} , idMedecin = '${ordonnanceMedecin}', idClient = '${ordonnanceClient}' , Ordonnances_date = '${ordonnanceDateDebut}' WHERE Ordonnances_id = ` + id
    mysqlconnexion.query(requeteSQL, (err, lignes, champs) => {
        if (!err) {
            console.log("Insertion terminé");

            let requetDel = 'DELETE FROM Prescriptions WHERE idOrdo = ' + id
            mysqlconnexion.query(requetDel, (err, lignes, champs) => {
                if (!err) {
                    for (i in req.body.selectMedicament) {
                        prescriptionMedicament = req.body.selectMedicament[i]
                        prescriptionQuantite = req.body.selectQte[i]
                        prescriptionFrequence = req.body.inputFrequence[i]
                        prescriptionDateFin = req.body.selectDateMed[i]

                        let requeteSQL3 = "INSERT INTO Prescriptions (idOrdo, idMedicament, Prescriptions_quantite, Prescriptions_frequence, Prescriptions_dateFin) VALUES"
                        requeteSQL3 += ` (${id},${prescriptionMedicament},${prescriptionQuantite},${prescriptionFrequence},'${prescriptionDateFin}')`
                        console.log(requeteSQL)
                        console.log(requeteSQL3)

                        mysqlconnexion.query(requeteSQL3, (err) => {
                            if (!err) {
                                console.log("Insertion terminé");
                                
                            } else {
                                console.log("Erreur lors de l'enregistrement")
                            }
                        })
                    }
                    res.redirect('.././liste_ordonnances')
                } else {
                    console.log("Insertion echouée");

                    console.log("Erreur lors de l'enregistrment")
                    res.send("Erreur ajout : " + JSON.stringify(err))
                }
            })
        } else {
            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })


}


//delete client
const delete_fiche_client = (req, res) => {
    id = req.params.id

    let requeteSQL = `DELETE FROM Clients WHERE clients_id = ` + id
    mysqlconnexion.query(requeteSQL, (err, lignes, champs) => {
        if (!err) {
            console.log("Suppression  terminé");
            res.redirect('./../liste_clients')
        } else {
            console.log("Insertion echouée");

            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })
}

const delete_fiche_ordonnance = (req, res) => {
    id = req.params.id

    let requeteSQL = `DELETE FROM Ordonnances WHERE Ordonnances_id = ` + id
    mysqlconnexion.query(requeteSQL, (err, lignes, champs) => {
        if (!err) {
            console.log("Suppression  terminé");
            res.redirect('./../liste_ordonnances')
        } else {
            console.log("Insertion echouée");

            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })
}

module.exports = {
    afficher_accueil,
    afficher_connexion,

    afficher_liste_clients,
    afficher_liste_ordonnances,
    afficher_liste_stocks,

    afficher_form_client,
    afficher_form_ordonnance,
    afficher_form_stock,
    afficher_dir,

    afficher_fiche_client,
    afficher_fiche_ordonnance,

    executer_form_ordonnance,
    executer_form_client,
    executer_form_stock,

    update_form_client,
    update_form_ordonnance,

    delete_fiche_client,
    delete_fiche_ordonnance
}

