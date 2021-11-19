
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
app.use(express.urlencoded());
app.use(session({
	secret:'leCodeSecretFlash',
	saveUninitialized: true,
	resave: true
}));
app.use(flash());

app.listen(3000, () => console.log('Le serveur sautheuhz est actif'))
app.get('/', (req, res) => {
    res.send('Le serveur sautheuhz est actif')
})
app.use('/sautheuhz', Routeur)
