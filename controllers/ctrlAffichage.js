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
    mysqlconnexion.query('SELECT idClient, clients_nom, clients_prenom, idMedecin, Medecins_nom, Medecins_prenom, idPath, Pathologies_libelle FROM Clients, Medecins, Pathologies, Ordonnances WHERE idClient = clients_id AND idMedecin = Medecins_id AND idPath = Pathologies_id', (err, contenuordo, champs) => {
        if (!err) {

            mysqlconnexion.query('SELECT DATE_FORMAT(Ordonnances_date, "%d/%m/%Y") as dateOrdo, idOrdo, max(Prescriptions_dateFin - Ordonnances_date) as dureeOrdonnance FROM Ordonnances, Prescriptions WHERE idOrdo = Ordonnances_id GROUP BY idOrdo ORDER BY dureeOrdonnance DESC ', (err, contenudate, champs) => {
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
    res.render('./liste_stocks', { titre: "Les stocks" })
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
    mysqlconnexion.query('SELECT *, DATE_FORMAT(clients_dateNaissance, "%Y-%m-%d") as dateN FROM Clients WHERE clients_id ='+id, (err, info_client, champs) => {
        mysqlconnexion.query('SELECT Mutuelles_nom, Mutuelles_id FROM Mutuelles', (err, lignes, champs) => {
            if (!err) {
                res.render('./fiche_client', {info_client: info_client, contenu: lignes, titre: "Fiche client"})
            }
        })
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
                    ordonnanceId = idOrdo[0].Ordonnances_id

                    for (i in req.body.selectMedicament) {
                        prescriptionMedicament = req.body.selectMedicament[i]
                        prescriptionQuantite = req.body.selectQte[i]
                        prescriptionFrequence = req.body.inputFrequence[i]
                        prescriptionDateFin = req.body.selectDateMed[i]

                        let requeteSQL3 = "INSERT INTO Prescriptions (idOrdo, idMedicament, Prescriptions_quantite, Prescriptions_frequence, Prescriptions_dateFin) VALUES"
                        requeteSQL3 += ` (${ordonnanceId},${prescriptionMedicament},${prescriptionQuantite},${prescriptionFrequence},'${prescriptionDateFin}')`
                        console.log(requeteSQL)
                        console.log(requeteSQL3)

                        mysqlconnexion.query(requeteSQL3, (err, lignes, champs) => {
                            if (!err) {
                                console.log("Insertion terminé");
                                res.redirect('./liste_ordonnances')
                            } else {
                                console.log("Erreur lors de l'enregistrement")
                            }
                        })
                    }
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
    let clientId = req.body.idIencli
    //reverse la date de naissance pour la mettre au format mysql
    clientBirthday = clientBirthday.split("/").reverse().join("/");

    clientTel = clientTel.split(' ').join('')
    clientNoSS = clientNoSS.split(' ').join('')

    let requeteSQL = `UPDATE Clients SET idMutuelle = ${clientMutuelle} , clients_noSS ='${clientNoSS}' , clients_nom = '${clientNom}', clients_prenom = '${clientPrenom}', clients_sexe = '${clientSexe}', clients_dateNaissance = '${clientBirthday}', clients_tel = ${clientTel}, clients_mail = '${clientMail}', clients_adresse = '${clientAdresse}', clients_ville = '${clientVille}', clients_cp = '${clientCp}' WHERE clients_id = `+id
    

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

    executer_form_ordonnance,
    executer_form_client,

    update_form_client

}
