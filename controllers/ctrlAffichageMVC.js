var db = require('../config/database');
var modelAffichage =require('../models/modelAffichage');
module.exports={
    afficher_liste_medecins:function(req,res){
        modelAffichage.afficher_liste_medecins(function(data){
            res.render('./liste_medecins', { contenu: data, titre: "Les médecins" })
        })
    }
}