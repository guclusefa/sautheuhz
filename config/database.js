var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'yourHost',
    user: 'user', 
    password: 'password',  
    database: 'database_name' 
});
conn.connect(function (err) {
    if (err) throw err;
    console.log('bdd  connecté avec succès !');
});
module.exports = conn;
