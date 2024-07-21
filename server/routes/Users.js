const jwt = require("jsonwebtoken");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const mysql = require("mysql2");

module.exports = (app) => {
  app.get("/users", cookieJwtAuth, async (req, res) => {
    const db = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "P@ssword1234",
      database: "gymApp",
    });

    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

  app.get("/this-user", cookieJwtAuth, async (req, res) => {
    const db = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "P@ssword1234",
      database: "gymApp",
    });
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);

    const sql = `SELECT * FROM users WHERE username = "${decoded.username}"`;
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
};
