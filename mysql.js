var mysql = require('mysql');
const { mysql_host, mysql_user, mysql_password } = require('./config');

var connection = mysql.createConnection({
  host: mysql_host,
  user: mysql_user,
  password: mysql_password,
  database: 'edutech'
});

connection.connect();

module.exports = connection;
