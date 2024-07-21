const express = require("express");
const router = express.Router();
const connection = require("../database.js");

// Route to get all users
router.get("/users", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Route to create a new user
router.post("/users", (req, res) => {
  const { username, password, email } = req.body;
  connection.query(
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
    [username, password, email],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).send("User created");
    }
  );
});

module.exports = router;
