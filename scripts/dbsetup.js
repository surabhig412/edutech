var mysql = require('mysql');
const { mysql_host, mysql_user, mysql_password, employee_user, employee_password, user, user_password } = require('./../config');

var createDatabase = function() {
  var connection = mysql.createConnection({
    host: mysql_host,
    user: mysql_user,
    password: mysql_password,
  });
  connection.connect(function(err) {
    if (err) throw err;
    var sql = "CREATE DATABASE IF NOT EXISTS edutech";
    connection.query(sql, function (err, result) {
      if (err) throw err;
      connection.query("use edutech");
      connection.query("SHOW TABLES LIKE 'users'", function(err, result) {
        if(err) throw err;
        if(result.length === 0) {
          createUserTable(connection);
        }
      });
      connection.query("SHOW TABLES LIKE 'tests'", function(err, result) {
        if(err) throw err;
        if(result.length === 0) {
          createTestTable(connection);
        }
      });
      connection.query("SHOW TABLES LIKE 'questions'", function(err, result) {
        if(err) throw err;
        if(result.length === 0) {
          createQuestionTable(connection);
        }
        connection.end();
      });
    });
  });
}

var createUserTable = function(connection) {
    var sql = "CREATE TABLE users (username VARCHAR(255), password VARCHAR(255), type VARCHAR(255))";
    connection.query(sql, function (err, result) {
      if (err) throw err;
    });
    var employee_details = {username: employee_user, password: employee_password, type: 'employee'};
    connection.query("INSERT into users set ?", employee_details, function (err, result) {
      if (err) throw err;
    });
    var user_details = {username: user, password: user_password, type: 'user'};
    connection.query("INSERT into users set ?", user_details, function (err, result) {
      if (err) throw err;
    });
}

var createTestTable = function(connection) {
    var sql = "CREATE TABLE tests (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), creator VARCHAR(255), description VARCHAR(255), status VARCHAR(255))";
    connection.query(sql, function (err, result) {
      if (err) throw err;
    });
}

var createQuestionTable = function(connection) {
    var sql = "CREATE TABLE questions (id INT AUTO_INCREMENT PRIMARY KEY, question_text VARCHAR(255), time int, description VARCHAR(255), answer VARCHAR(255), test_id int, CONSTRAINT test_id FOREIGN KEY (test_id) REFERENCES tests (id))";
    connection.query(sql, function (err, result) {
      if (err) throw err;
    });
}

createDatabase();
