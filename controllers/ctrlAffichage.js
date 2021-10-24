
// afficher page
const afficher_accueil = (req, res) => {
    res.render('./accueil', {titre: "Accueil"})
}

const afficher_connexion = (req, res) => {
    res.render('./connexion', {titre: "Connexion"})
}

// les listes
const afficher_liste_clients = (req, res) => {
    res.render('./liste_clients', {titre: "Les clients"})
}

const afficher_liste_ordonnances = (req, res) => {
    res.render('./liste_ordonnances', {titre: "Les ordonnances"})
}

const afficher_liste_stocks = (req, res) => {
    res.render('./liste_stocks', {titre: "Les stocks"})
}

// les forumalires
const afficher_form_client = (req, res) => {
    res.render('./form_client', {titre: "Formulaire client"})
}

const afficher_form_ordonnance = (req, res) => {
    res.render('./form_ordonnance', {titre: "Formulaire ordonnance"})
}

const afficher_form_stock = (req, res) => {
    res.render('./form_stock', {titre: "Formulaire stock"})
}

// afficher vue même nom que directory -> test
const afficher_dir = (req, res) => {
    res.render('./'+req.params.dir)
}

/*const afficher_test = (req,res) => {
    res.render("./test", { titre : "test" })

    mysqlconnexion.query('SELECT Clients.clients_id, Clients.idMutuelle, Clients.clients_noSS, Clients.clients_nom, Clients.clients_prenom, Clients.clients_sexe, Clients.clients_dateNaissance, Clients.clients_tel, Clients.clients_mail, Clients.clients_adresse, Clients.clients_ville, Clients.clients_cp, Mutuelles.nom FROM Clients, Mutuelles',(err, lignes, champs) => {
        if (!err) { 
            console.log(lignes)
            res.send(lignes)}
            //res.render("./test", { titre : "test", contenu : lignes })
    })
}*/

/*app.get('/test', (req, res) => {
    mysqlconnexion.query('SELECT clients.id, clients.idMutuelle, cients.noSS, clients.cli_nom, clients.prenom, clients.sexe, clients.dateNaissance, clients.tel, clients.mail, clients.adresse, clients.ville, clients.cp, Mutuelles.nom FROM Clients, Mutuelles', (err, lignes, champs) => {
        if (!err) { 
            console.log(lignes)
            res.render("test", {contenu : lignes , titre : "test"})}
    })
    res.send("fzfz")
})*/

module.exports = {
    afficher_accueil,
    afficher_connexion,
    
    afficher_liste_clients,
    afficher_liste_ordonnances,
    afficher_liste_stocks,

    afficher_form_client,
    afficher_form_ordonnance,
    afficher_form_stock,
    afficher_dir
}
