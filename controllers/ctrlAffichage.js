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

const afficher_liste_commandes = (req, res) => {
    res.render('./liste_commandes', {titre: "Les commandes"})
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

const afficher_form_commande = (req, res) => {
    res.render('./form_commande', {titre: "Formulaire commande"})
}

// afficher vue même nom que directory -> test
const afficher_dir = (req, res) => {
    res.render('./'+req.params.dir)
}

module.exports = {
    afficher_accueil,
    afficher_connexion,
    
    afficher_liste_clients,
    afficher_liste_ordonnances,
    afficher_liste_stocks,
    afficher_liste_commandes,

    afficher_form_client,
    afficher_form_ordonnance,
    afficher_form_stock,
    afficher_form_commande,

    afficher_dir
}
