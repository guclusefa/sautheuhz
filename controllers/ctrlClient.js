/*
Le controller permet d'excuter une fonction au moment voulu, c'est ici que l'on execute les requetes sql.
Le controller Client permet d'executer les fonctions et requetes clients, à savoir : 
    -afficher la liste des clients avec leurs données
    -afficher le formulaire d'ajout de clients en recupérant les données déja présentes dans la base(les mutuelles)
    -afficher une fiche individuelle sous forme de formulaire pour chaque client, permettant également de modifier les données
    -éxécuter le formulaire d'ajout de clients
    -éxécuter le formulaire de modification des données clients
    -supprimer les données clients 
*/

var modelClient = require('../models/modelClient');
module.exports = {
//afficher la liste des clients avec leurs données
    afficher_liste_clients: function (req, res) {
        modelClient.afficher_liste_clients(function (data) {
            console.log(data)
            res.render('./liste_clients', { contenu: data, titre: "Liste des clients", valid: req.flash('valid'), erreur: req.flash('erreur') });
        });
    },
//afficher le formulaire d'ajout de clients en recupérant les données invariables (les mutuelles)
    afficher_form_client: function (req, res) {
        modelClient.afficher_form_client(function (data) {
            res.render('./form_client', { contenu: data, titre: "Formulaire client", valid: req.flash('valid'), erreur: req.flash('erreur') })
        });
    },
//afficher une fiche individuelle sous forme de formulaire pour chaque client, permettant également de modifier les données
    afficher_fiche_client: function (req, res) {
        //recup l'id de l'objet cliqué
        let id = req.params.id;
        modelClient.afficher_fiche_client(id, function (data, data2) {
            console.log(data);
            res.render('./fiche_client', { info_client: data, contenu: data2, titre: "Fiche client", valid: req.flash('valid'), erreur: req.flash('erreur') })
        });
    },
//éxécuter le formulaire d'ajout de clients
    executer_form_client: function (req, res) {
        //récupération des différentes entrées client dans le formulaire 
        let clients_nom = req.body.inputNom
        let clients_prenom = req.body.inputPrenom
        let clients_mail = req.body.inputEmail
        let clients_tel = req.body.inputTel
        let clients_sexe = req.body.selectSexe
        let clients_dateNaissance = req.body.inputDate
        let clients_adresse = req.body.inputAdresse
        let clients_ville = req.body.inputVille
        let clients_cp = req.body.inputCp
        let clients_noSS = req.body.inputSS
        let idMutuelle = req.body.selectMutuelle
        //verifie si les champs ne sont pas vides, sinon renvoie un message d'erreur
        if (clients_nom === "" || clients_prenom === "" || clients_mail  === "" || clients_tel === "" || clients_sexe === "" || clients_dateNaissance === "" || clients_adresse === "" || clients_ville === "" || clients_cp === "" || clients_noSS === "" || idMutuelle === "") {
            req.flash('erreur', 'Remplir tout les champs');
            res.redirect('./form_client')
        } else {
            //reverse la date de naissance pour la mettre au format mysql
            clients_dateNaissance = clients_dateNaissance.split("/").reverse().join("/");
            //permet d'enlever les espaces dans le numéro de téléphone et de sécu sociale créé côté client
            clients_tel = clients_tel.split(' ').join('')
            clients_noSS = clients_noSS.split(' ').join('')
            //prepare la variable a passé dans la requete sql pour insert
            let clientParam = { idMutuelle, clients_noSS, clients_nom, clients_prenom, clients_sexe, clients_dateNaissance, clients_tel, clients_mail, clients_adresse, clients_ville, clients_cp }
            //execution de la requete sql se trouvant dans le modelClient
            modelClient.executer_form_client(clientParam, function (data) {
                console.log(data)
                req.flash('valid', 'Ajout de client terminé');
                res.redirect('./liste_clients')
            })
        }
    },
//éxécuter le formulaire de modification des données clients
    update_form_client: function (req, res) {
        //recup l'id de l'objet cliqué
        let id = req.params.id
        //récupération des différentes entrées client dans le formulaire 
        //si non modifiés il s'agit des données client contenu dans la BDD
        let clients_nom = req.body.inputNom
        let clients_prenom = req.body.inputPrenom
        let clients_mail = req.body.inputEmail
        let clients_tel = req.body.inputTel
        let clients_sexe = req.body.selectSexe
        let clients_dateNaissance = req.body.inputDate
        let clients_adresse = req.body.inputAdresse
        let clients_ville = req.body.inputVille
        let clients_cp = req.body.inputCp
        let clients_noSS = req.body.inputSS
        let idMutuelle = req.body.selectMutuelle
        //verifie si les champs ne sont pas vides, sinon renvoie un message d'erreur
        if (clients_nom === "" || clients_prenom === "" || clients_mail  === "" || clients_tel === "" || clients_sexe === "" || clients_dateNaissance === "" || clients_adresse === "" || clients_ville === "" || clients_cp === "" || clients_noSS === "" || idMutuelle === "") {
            req.flash('erreur', 'Remplir tout les champs');
            res.redirect('./../fiche_client/' + id)
        } else {
            //reverse la date de naissance pour la mettre au format mysql
            clients_dateNaissance = clients_dateNaissance.split("/").reverse().join("/");
            //permet d'enlever les espaces dans le numéro de téléphone et de sécu sociale créé côté client
            clients_tel = clients_tel.split(' ').join('')
            clients_noSS = clients_noSS.split(' ').join('')
            //prepare la variable a passé dans la requete sql pour update
            let clientParam = { idMutuelle, clients_noSS, clients_nom, clients_prenom, clients_sexe, clients_dateNaissance, clients_tel, clients_mail, clients_adresse, clients_ville, clients_cp }
        //recup l'id de l'objet cliqué
        modelClient.update_form_client([clientParam, id], function (data) {
                console.log(data)
                req.flash('valid', 'Modification terminé');
                res.redirect('./../liste_clients')
            })
        }
    },
//supprimer les données clients 
    delete_fiche_client: function (req, res) {
        //recup l'id de l'objet cliqué
        id = req.params.id
        modelClient.delete_fiche_client(id, function (data) {
            console.log(data);
            req.flash('valid', 'Suppression du client terminé');
            res.redirect('./../liste_clients')
        });
    }
}
