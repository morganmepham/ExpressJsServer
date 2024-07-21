const mysql = require("mysql2");

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // replace with your MySQL username
  password: "P@ssword1234", // replace with your MySQL password
  database: "gymapp",
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = connection;
