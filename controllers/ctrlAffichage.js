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

// afficher vue même nom que directory -> test
const afficher_dir = (req, res) => {
    res.render('./' + req.params.dir)
}


// afficher page
const afficher_accueil = (req, res) => {
    mysqlconnexion.query('SELECT * FROM Stocks, Medicaments WHERE Medicaments_id = idMedicament ', (err, lignes, champs) => {
        mysqlconnexion.query('SELECT  *, COUNT(*) as total FROM Pathologies, Ordonnances WHERE idPath = Pathologies_id GROUP BY idPath', (err, resPath, champs) => {
            mysqlconnexion.query('SELECT * FROM Stocks, Medicaments WHERE Medicaments_id = idMedicament ', (err, lignes, champs) => {
                if (!err) {
                    // chart stock
                    var lesMeds = []
                    var lesDonnesMeds = []
                    for (let i = 0; i < lignes.length; i++) {
                        lesMeds.push(lignes[i].Medicaments_libelle)
                        lesDonnesMeds.push(lignes[i].Stocks_quantite)
                    }
                    /* console.log(JSON.stringify(lesDonnesMeds))
                    console.log(JSON.parse(JSON.stringify(lesMeds))) */

                    // chart stock a prevoir
                    lesMois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
                    var d = new Date();
                    var prochainMois = [lesMois[d.getMonth()]]
                    var prochainMoisEnNombre = [d.getMonth() + 1]
                    for (let i = 0; i < 6; i++) {
                        d.setMonth(d.getMonth() + 1);
                        prochainMois.push(lesMois[d.getMonth()])
                        prochainMoisEnNombre.push(d.getMonth() + 1)
                    }
                    /* console.log(prochainMois)
                    console.log(prochainMoisEnNombre) */

                    // chart pathologies
                    var lesPath = []
                    var lesDonnesPaths = []
                    for (let i = 0; i < resPath.length; i++) {
                        lesPath.push(resPath[i].Pathologies_libelle)
                        lesDonnesPaths.push(resPath[i].total)
                    }
                    console.log(resPath)
                    res.render('./accueil', { lesPath: lesPath, lesDonnesPaths: JSON.stringify(lesDonnesPaths), prochainMois: prochainMois, prochainMoisEnNombre: JSON.stringify(prochainMoisEnNombre), lesMeds: lesMeds, lesDonnesMeds: JSON.stringify(lesDonnesMeds), contenu: lignes, titre: "Liste des clients" })
                }
            })
        })
    })
}

const afficher_connexion = (req, res) => {
    res.render('./connexion', { titre: "Connexion" })
}

// les listes
const afficher_liste_clients = (req, res) => {
    mysqlconnexion.query('SELECT clients_id, idMutuelle, clients_noSS, clients_nom, clients_prenom, clients_sexe, DATE_FORMAT(clients_dateNaissance, "%d/%m/%Y") as clients_dateNaissance, clients_tel, clients_mail, clients_adresse, clients_ville , clients_cp, idMutuelle, Mutuelles_id, Mutuelles_Nom FROM Clients, Mutuelles WHERE idMutuelle = Mutuelles_id AND clients_id <>29', (err, lignes, champs) => {
        if (!err) {
            console.log(lignes)
            res.render('./liste_clients', { contenu: lignes, titre: "Liste des clients" })
        }
    })
}

const afficher_liste_ordonnances = (req, res) => {
    // 73 = numero variable en fonction du numero de l'ordonnance test (de preference la mettre en 1)
    let requeteSQL1 = 'SELECT * FROM Ordonnances WHERE Ordonnances_id >73'
    let requeteSQL2 = 'SELECT DATE_FORMAT(Ordonnances_date, "%d/%m/%Y") as dateOrdo, idOrdo, max(Prescriptions_dateFin - Ordonnances_date) as dureeOrdonnance, clients_nom, clients_prenom, Medecins_nom, Medecins_prenom, Pathologies_libelle FROM Pathologies, Medecins, Clients, Ordonnances, Prescriptions WHERE idPath = Pathologies_id AND idOrdo = Ordonnances_id AND clients_id = idClient AND idMedecin = Medecins_id AND Ordonnances_id >73 GROUP BY idOrdo ORDER BY dureeOrdonnance DESC '
    let requeteSQL3 = 'SELECT *, Prescriptions_dateFin - Ordonnances_date as duree, DATE_FORMAT(Prescriptions_dateFin, "%d/%m/%Y") as dateFin FROM Prescriptions, Medicaments, Ordonnances WHERE idMedicament = Medicaments_id AND idOrdo = Ordonnances_id'
   
    mysqlconnexion.query(requeteSQL1, (err, contenuordo, champs) => {
        if (!err) {

            mysqlconnexion.query(requeteSQL2, (err, contenudate, champs) => {
                if (!err) {
                    mysqlconnexion.query(requeteSQL3, (err, contenupresciptions, champs) => {
                        if (!err) {
                            console.log(contenudate)
                            res.render('./liste_ordonnances', { contenu: contenuordo, date: contenudate, prescriptions: contenupresciptions,  titre: "Les ordonnances" })
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

/*const afficher_liste_medecins = (req, res) => {
    mysqlconnexion.query('SELECT * FROM Medecins ', (err, medinfo, champs) => {
        if (!err) {
            console.log(medinfo)
            res.render('./liste_medecins', { contenu: medinfo, titre: "Les médecins" })
        }
    })
}*/

const afficher_liste_mutuelles = (req, res) => {
    mysqlconnexion.query('SELECT * FROM Mutuelles ', (err, mutinfo, champs) => {
        if (!err) {
            console.log(mutinfo)
            res.render('./liste_mutuelles', { contenu: mutinfo, titre: "Les mutuelles" })
        }
    })
}

const afficher_liste_pathologies = (req, res) => {

    mysqlconnexion.query('SELECT * FROM Pathologies ', (err, pathinfo, champs) => {
        if (!err) {
            console.log(pathinfo)
            res.render('./liste_pathologies', { contenu: pathinfo, titre: "Les pathologies" })
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

const afficher_form_medecin = (req, res) => {
    res.render('./form_medecin', { contenu: medinfo, titre: "Formulaire médecin" })
}

const afficher_form_mutuelle = (req, res) => {
    res.render('./form_mutuelle', { titre: "Formulaire mutuelle" })
}

const afficher_form_pathologie = (req, res) => {
    res.render('./form_pathologie', { titre: "Formulaire pathologie" })
}

// les fiches
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

const afficher_fiche_medecin = (req, res) => {

    id = req.params.id
    requeteSQL = `SELECT* FROM Medecins WHERE Medecins_id =` + id
    mysqlconnexion.query(requeteSQL, (err, medinfo, champs) => {
        if (!err) {
            console.log(medinfo)
            res.render('./fiche_medecin', { contenu: medinfo, titre: "Fiche médecin" })

        }
    })
}

const afficher_fiche_mutuelle = (req, res) => {
    id = req.params.id
    requeteSQL = `SELECT * FROM Mutuelles WHERE Mutuelles_id =` + id
    mysqlconnexion.query(requeteSQL, (err, mutinfo, champs) => {
        if (!err) {
            console.log(mutinfo)
            res.render('./fiche_mutuelle', { contenu: mutinfo, titre: "Fiche mutuelle" })

        }
    })
}

const afficher_fiche_pathologie = (req, res) => {

    id = req.params.id
    requeteSQL = `SELECT * FROM Pathologies WHERE Pathologies_id =` + id
    mysqlconnexion.query(requeteSQL, (err, pathinfo) => {
        if (!err) {
            console.log(pathinfo)
            res.render('./fiche_pathologie', { contenu: pathinfo, titre: "Fiche pathologie" })

        }
    })
}
const afficher_fiche_stock = (req, res) => {
    id = req.params.id
    requeteSQL = `SELECT * FROM Stocks, Medicaments WHERE Medicaments_id =` + id + ` AND Medicaments_id = idMedicament `
    mysqlconnexion.query(requeteSQL, (err, stockinfo) => {
        if (!err) {
            console.log(stockinfo)
            res.render('./fiche_stock', { contenu: stockinfo, titre: "Fiche stock" })

        }
    })
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

const executer_form_stock = (req, res) => {
    let medicamentNom = req.body.inputMed
    let medicamentQuantite = req.body.inputQte

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

                            let requeteSQL4 = `INSERT INTO Prescriptions (idOrdo, idMedicament, Prescriptions_quantite, Prescriptions_frequence, Prescriptions_dateFin) VALUES (73,${idm}, 0, 0, '2099-11-01')`
                            mysqlconnexion.query(requeteSQL4, (err, champs) => {
                                if (!err) {
                                    console.log("insertion  terminé");

                                    res.redirect('./liste_stocks')
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




        } else {

            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })
}


//ajouter un medecin 

const executer_form_medecin = (req, res) => {

    let medecinNom = req.body.inputNom
    let medecinPrenom = req.body.inputPrenom
    let medecinMail = req.body.inputEmail
    let medecinTel = req.body.inputTel
    let medecinOrdreNo = req.body.inputOrdre

    medecinTel = medecinTel.split(' ').join('')

    let requeteSQL = "INSERT INTO Medecins (Medecins_noOrdre, Medecins_nom, Medecins_prenom, Medecins_tel, Medecins_mail) VALUES"
    requeteSQL += ` (${medecinOrdreNo},'${medecinNom}','${medecinPrenom}',${medecinTel} , '${medecinMail}' )`

    mysqlconnexion.query(requeteSQL, (err, champs) => {
        if (!err) {
            console.log("Insertion terminé");
            res.redirect('./liste_medecins')
        } else {
            console.log("Insertion echouée");

            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })
}

//ajouter une mutuelle

const executer_form_mutuelle = (req, res) => {

    let mutuelleNom = req.body.inputNomMutu
    let mutuelleMail = req.body.inputEmail
    let mutuelleTel = req.body.inputTel
    mutuelleTel = mutuelleTel.split(' ').join('')

    let requeteSQL = "INSERT INTO Mutuelles (Mutuelles_nom, Mutuelles_tel, Mutuelles_mail) VALUES"
    requeteSQL += ` ('${mutuelleNom}',${mutuelleTel},'${mutuelleMail}')`

    mysqlconnexion.query(requeteSQL, (err, champs) => {
        if (!err) {
            console.log("Insertion terminé");
            res.redirect('./liste_mutuelles')
        } else {
            console.log("Insertion echouée");

            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })
}

//ajouter une pathologie
const executer_form_pathologie = (req, res) => {
    let pathologieNom = req.body.inputNomMutu
    let requeteSQL = "INSERT INTO Pathologies (Pathologies_libelle) VALUES"
    requeteSQL += ` ('${pathologieNom}')`

    mysqlconnexion.query(requeteSQL, (err, champs) => {
        if (!err) {
            console.log("Insertion terminé");
            res.redirect('./liste_pathologies')
        } else {
            console.log("Insertion echouée");

            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })
}


const update_form_client = (req, res) => {
    let id = req.params.id


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
    //enleve les espaces des variablessuivantes
    clientTel = clientTel.split(' ').join('')
    clientNoSS = clientNoSS.split(' ').join('')

    let requeteSQL = `UPDATE Clients SET idMutuelle = ${clientMutuelle} , clients_noSS ='${clientNoSS}' , clients_nom = '${clientNom}', clients_prenom = '${clientPrenom}', clients_sexe = '${clientSexe}', clients_dateNaissance = '${clientBirthday}', clients_tel = ${clientTel}, clients_mail = '${clientMail}', clients_adresse = '${clientAdresse}', clients_ville = '${clientVille}', clients_cp = '${clientCp}' WHERE clients_id =` + id
    mysqlconnexion.query(requeteSQL, (err,champs) => {
        if (!err) {
            console.log("Insertion terminé");
            res.redirect('./../liste_clients')
        } else {
            console.log("Insertion echouée");
            console.log(requeteSQL)
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
//reverse de a date pour la mettre au format SQL
    ordonnanceDateDebut = ordonnanceDateDebut.split("/").reverse().join("/");

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


const update_form_medecin = (req, res) => {
    id = req.params.id

    let medecinNom = req.body.inputNom
    let medecinPrenom = req.body.inputPrenom
    let medecinMail = req.body.inputEmail
    let medecinTel = req.body.inputTel
    let medecinOrdreNo = req.body.inputOrdre
    //reverse la date de naissance pour la mettre au format mysql
    medecinTel = medecinTel.split(' ').join('')

    let requeteSQL = `UPDATE Medecins SET Medecins_noOrdre = ${medecinOrdreNo} , Medecins_nom ='${medecinNom}' , Medecins_prenom = '${medecinPrenom}', Medecins_tel = '${medecinTel}', Medecins_mail = '${medecinMail}' WHERE Medecins_id = ` + id
    mysqlconnexion.query(requeteSQL, (err, lignes, champs) => {
        if (!err) {
            console.log("Insertion terminé");
            res.redirect('./../liste_medecins')
        } else {
            console.log("Insertion echouée");

            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })

}

const update_form_mutuelle = (req, res) => {
    id = req.params.id
    let mutuelleNom = req.body.inputNomMutu
    let mutuelleMail = req.body.inputEmail
    let mutuelleTel = req.body.inputTel
    //reverse la date de naissance pour la mettre au format mysql
    mutuelleTel = mutuelleTel.split(' ').join('')

    let requeteSQL = `UPDATE Mutuelles SET Mutuelles_nom = '${mutuelleNom}' , Mutuelles_tel =${mutuelleTel} , Mutuelles_mail = '${mutuelleMail}' WHERE Mutuelles_id = ` + id
    mysqlconnexion.query(requeteSQL, (err) => {
        if (!err) {
            console.log("Insertion terminé");
            res.redirect('./../liste_mutuelles')
        } else {
            console.log("Insertion echouée");

            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })

}

const update_form_pathologie = (req, res) => {
    id = req.params.id
    let pathologieLibelle = req.body.inputNomMutu

    let requeteSQL = `UPDATE Pathologies SET Pathologies_libelle = '${pathologieLibelle}' WHERE Pathologies_id = ` + id
    mysqlconnexion.query(requeteSQL, (err) => {
        if (!err) {
            console.log("Insertion terminé");
            res.redirect('./../liste_pathologies')
        } else {
            console.log("Insertion echouée");

            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })

}

const update_form_stock = (req, res) => {
    let id = req.params.id
    let medicamentNom = req.body.inputMed
    let medicamentQuantite = req.body.inputQte


    let requeteSQL = `UPDATE Medicaments SET Medicaments_libelle = '${medicamentNom}' WHERE Medicaments_id = ` + id
    mysqlconnexion.query(requeteSQL, (err) => {
        if (!err) {
            let requeteSQL = `UPDATE Stocks SET Stocks_quantite = '${medicamentQuantite}' WHERE idMedicament = ` + id
            mysqlconnexion.query(requeteSQL, (err) => {
                if (!err) {
                    console.log("Insertion terminé");
                    res.redirect('./../liste_stocks')
                } else {
                    console.log("Insertion echouée");

                    console.log("Erreur lors de l'enregistrment")
                    res.send("Erreur ajout : " + JSON.stringify(err))
                }
            })
        } else {
            console.log("Insertion echouée");

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

const delete_fiche_medecin = (req, res) => {
    id = req.params.id
    let requeteSQL = `DELETE FROM Medecins WHERE Medecins_id = ` + id
    mysqlconnexion.query(requeteSQL, (err, champs) => {
        if (!err) {
            console.log("Suppression  terminé");
            res.redirect('./../liste_medecins')
        } else {
            console.log("Insertion echouée");

            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })
}

const delete_fiche_mutuelle = (req, res) => {
    id = req.params.id
    let requeteSQL = `DELETE FROM Mutuelles WHERE Mutuelles_id = ` + id
    mysqlconnexion.query(requeteSQL, (err, champs) => {
        if (!err) {
            console.log("Suppression  terminé");
            res.redirect('./../liste_mutuelles')
        } else {
            console.log("Insertion echouée");

            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : " + JSON.stringify(err))
        }
    })
}

const delete_fiche_pathologie = (req, res) => {
    id = req.params.id
    let requeteSQL = `DELETE FROM Pathologies WHERE Pathologies_id = ` + id
    mysqlconnexion.query(requeteSQL, (err, champs) => {
        if (!err) {
            console.log("Suppression  terminé");
            res.redirect('./../liste_pathologies')
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
    //afficher_liste_medecins,
    afficher_liste_mutuelles,
    afficher_liste_pathologies,

    afficher_form_client,
    afficher_form_ordonnance,
    afficher_form_stock,
    afficher_form_medecin,
    afficher_form_mutuelle,
    afficher_form_pathologie,
    afficher_dir,

    afficher_fiche_client,
    afficher_fiche_ordonnance,
    afficher_fiche_stock,
    afficher_fiche_medecin,
    afficher_fiche_mutuelle,
    afficher_fiche_pathologie,

    executer_form_ordonnance,
    executer_form_client,
    executer_form_stock,
    executer_form_medecin,
    executer_form_mutuelle,
    executer_form_pathologie,


    update_form_client,
    update_form_ordonnance,
    update_form_medecin,
    update_form_mutuelle,
    update_form_pathologie,
    update_form_stock,

    delete_fiche_client,
    delete_fiche_ordonnance,
    delete_fiche_medecin,
    delete_fiche_mutuelle,
    delete_fiche_pathologie
}

