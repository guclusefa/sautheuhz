
// inclure les dépendances et middlewares
const mysql = require('mysql')
const express = require('express')
const ejs = require('ejs')
const session = require('express-session');
const flash = require('connect-flash');

const iniparser = require('iniparser')
const Routeur = require('./routes/routes');

// activer les dépendances
let app = express()
app.set('view engine', 'ejs')
app.use(express.static('assets'))
app.use(express.static('views'))

app.use(session({
	secret:'leCodeSecretFlash',
	saveUninitialized: true,
	resave: true
}));

app.use(flash());

// connexion mysql
let configDB = iniparser.parseSync('config/DB.ini')
let mysqlconnexion = mysql.createConnection({
    host: configDB['dev']['host'],
    user: configDB['dev']['user'],
    password: configDB['dev']['password'],
    database: configDB['dev']['dbname']
})
mysqlconnexion.connect((err) => {
    if (!err) console.log('BDD connectée.')
    else console.log('BDD connexion échouée \n Erreur: ' + JSON.stringify(err))
})

app.listen(3000, () => console.log('Le serveur sautheuhz est actif'))
app.get('/', (req, res) => {
    res.send('Le serveur sautheuhz est actif')
})

app.use('/sautheuhz', Routeur)
