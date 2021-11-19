var db = require('../config/database');
var modelAccueil = require('../models/modelAccueil');
module.exports = {

    afficher_accueil: function (req, res) {

        modelAccueil.afficher_accueil(function (data, data2, data3) {
            // chart stock
            var lesMeds = []
            var lesDonnesMeds = []
            for (let i = 0; i < data3.length; i++) {
                lesMeds.push(data3[i].Medicaments_libelle)
                lesDonnesMeds.push(data3[i].Stocks_quantite)
            }
            /* console.log(JSON.stringify(lesDonnesMeds))
            console.log(JSON.parse(JSON.stringify(lesMeds))) */

            // chart stock a prevoir
            lesMois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
            var d = new Date();
            var prochainMois = [lesMois[d.getMonth()]]
            var prochainMoisEnNombre = [d.getMonth() + 1]
            for (let i = 0; i < 6; i++) {
                d.setMonth(d.getMonth() + 1);
                prochainMois.push(lesMois[d.getMonth()])
                prochainMoisEnNombre.push(d.getMonth() + 1)
            }
            /* console.log(prochainMois)
            console.log(prochainMoisEnNombre) */

            // chart pathologies
            var lesPath = []
            var lesDonnesPaths = []
            for (let i = 0; i < data2.length; i++) {
                lesPath.push(data2[i].Pathologies_libelle)
                lesDonnesPaths.push(data2[i].total)
            }
            res.render('./accueil', { lesPath: lesPath, lesDonnesPaths: JSON.stringify(lesDonnesPaths), prochainMois: prochainMois, prochainMoisEnNombre: JSON.stringify(prochainMoisEnNombre), lesMeds: lesMeds, lesDonnesMeds: JSON.stringify(lesDonnesMeds), contenu: data3, titre: "Liste des clients" })
        });
    },
}