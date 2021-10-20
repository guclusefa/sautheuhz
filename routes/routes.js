// création du routeur Express pour ce module
const express = require('express');
const routeur = express.Router();
let app = express()
const LivreControle = require('../controllers/LivreController');


// voir tous les messages
routeur.get('/')
    .get('/formulaire', LivreControle.livreOr_form)
    .get('/search', LivreControle.livreOr_recherche)
    .get('/:id', LivreControle.livreOr_selection)
    .get('/delete/:id', LivreControle.livreOr_suppression)
    .post('/', LivreControle.livreOr_creation);

// afficher le formulaire




module.exports = routeur;
