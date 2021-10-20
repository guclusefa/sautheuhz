const afficher_accueil = (req, res) => {
    res.render('./accueil')
}

const afficher_liste_clients = (req, res) => {
    titre = "test"
    res.render('./liste_clients', {titre:"test"})
}

const afficher_liste_ordonnances = (req, res) => {
    res.render('./liste_ordonnances')
}

const afficher_liste_stocks = (req, res) => {
    res.render('./liste_stocks')
}

const afficher_liste_commandes = (req, res) => {
    res.render('./liste_commandes')
}
module.exports = {
    afficher_accueil,
    afficher_liste_clients,
    afficher_liste_ordonnances,
    afficher_liste_stocks,
    afficher_liste_commandes
}
