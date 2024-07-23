// const mysql = require("mysql2");

// function createDbConnection() {
//   return mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "P@ssword1234",
//     database: "gymApp",
//   });
// }

// module.exports = createDbConnection;

const mysql = require("mysql2/promise");

const createDbConnection = async () => {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "P@ssword1234",
    database: "gymApp",
  });
};

module.exports = createDbConnection;
