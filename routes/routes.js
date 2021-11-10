// création du routeur Express pour ce module
const express = require('express');
const routeur = express.Router();
const affichageControl = require('../controllers/ctrlAffichage');

// afficher les pages
routeur.get('/', affichageControl.afficher_accueil)
    .get('/accueil', affichageControl.afficher_accueil)
    .get('/connexion', affichageControl.afficher_connexion)


    .get('/liste_clients', affichageControl.afficher_liste_clients)
    .get('/liste_ordonnances', affichageControl.afficher_liste_ordonnances)
    .get('/liste_stocks', affichageControl.afficher_liste_stocks)

    .get('/form_client', affichageControl.afficher_form_client)
    .get('/form_ordonnance', affichageControl.afficher_form_ordonnance)
    .get('/form_stock', affichageControl.afficher_form_stock)
    // .get('/:dir', affichageControl.afficher_dir)
    
    .get('/fiche_client/:id', affichageControl.afficher_fiche_client)
    .get('/fiche_ordonnance/:id', affichageControl.afficher_fiche_ordonnance)

    //executer les formulaires
    .post('/form_ordonnance', affichageControl.executer_form_ordonnance)
    .post('/form_client', affichageControl.executer_form_client)

    //modifier / supprimer données
    .post('/fiche_client/:id', affichageControl.update_form_client)
    .post('/delete_client/:id', affichageControl.delete_fiche_client)
    
    .post('/delete_ordonnances/:id', affichageControl.delete_fiche_ordonnance)

    
module.exports = routeur;





