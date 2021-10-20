// création du routeur Express pour ce module
const express = require('express');
const routeur = express.Router();
const affichageControl = require('../controllers/ctrlAffichage');

// afficher les pages
routeur.get('/', affichageControl.afficher_accueil)
    .get('/accueil', affichageControl.afficher_accueil)
    .get('/liste_clients', affichageControl.afficher_liste_clients)
    .get('/liste_ordonnances', affichageControl.afficher_liste_ordonnances)
    .get('/liste_stocks', affichageControl.afficher_liste_stocks)
    .get('/liste_commandes', affichageControl.afficher_liste_commandes)

module.exports = routeur;
