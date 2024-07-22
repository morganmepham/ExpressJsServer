const mysql = require("mysql2");

function createDbConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "P@ssword1234",
    database: "gymApp",
  });
}

module.exports = createDbConnection;
