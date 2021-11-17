var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'mysql-sautheuhz.alwaysdata.net',
    user: 'sautheuhz_root', 
    password: 'IlianSefa386',  
    database: 'sautheuhz_bdd' 
});
conn.connect(function (err) {
    if (err) throw err;
    console.log('Database is connected successfully !');
});
module.exports = conn;