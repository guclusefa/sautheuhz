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
    mysqlconnexion.query('SELECT clients_id, idMutuelle, clients_noSS, clients_nom, clients_prenom, clients_sexe, clients_dateNaissance, clients_tel, clients_mail, clients_adresse, clients_ville , clients_cp, idMutuelle, Mutuelles_id, Mutuelles_Nom FROM Clients, Mutuelles WHERE idMutuelle = Mutuelles_id', (err, lignes, champs) => {
        if (!err) {
            console.log(lignes)
            res.render('./liste_clients', { contenu: lignes, titre: "Liste des clients" })
        }
    })
}

const afficher_liste_ordonnances = (req, res) => {

   
    res.render('./liste_ordonnances', { titre: "Les ordonnances" })
}

const afficher_liste_stocks = (req, res) => {
    res.render('./liste_stocks', { titre: "Les stocks" })
}



// les forumalires
const afficher_form_client = (req, res) => {

    mysqlconnexion.query('SELECT Mutuelles_nom, Mutuelles_id FROM Mutuelles', (err, lignes, champs) => {
        if (!err) {
            res.render('./form_client', { contenu: lignes , titre: "Formulaire client" })
        }
    })


}

const afficher_form_ordonnance = (req, res) => {
    res.render('./form_ordonnance', { titre: "Formulaire ordonnance" })
}

const afficher_form_stock = (req, res) => {

    res.render('./form_stock', { titre: "Formulaire stock" })
}

// afficher vue même nom que directory -> test
const afficher_dir = (req, res) => {
    res.render('./' + req.params.dir)
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

    let requeteSQL = "INSERT INTO Clients (idMutuelle, clients_noSS, clients_nom, clients_prenom, clients_sexe, clients_dateNaissance, clients_tel, clients_mail, clients_adresse, clients_ville, clients_cp) VALUES"
    requeteSQL += ` (${clientMutuelle},'${clientNoSS}','${clientNom}','${clientPrenom}' , '${clientSexe}' ,'${clientBirthday}', ${clientTel},'${clientMail}', '${clientAdresse}', '${clientVille}', '${clientCp}')`
    
    mysqlconnexion.query( requeteSQL, (err, lignes, champs) => {
        if (!err) {
            console.log("Insertion terminé");
            res.redirect('./liste_clients')
        } else {
            console.log("Erreur lors de l'enregistrment")
            res.send("Erreur ajout : "+JSON.stringify(err))
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
    
    executer_form_client
}
