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


module.exports = {
    executer_form_stock
}
