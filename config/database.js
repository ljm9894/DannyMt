const mysql = require('mysql');
require('dotenv').config;
const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "123456",
    port : process.env.PORT,
    database : "danny"
});

module.exports = {
    db
};