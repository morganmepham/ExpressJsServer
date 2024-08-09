// src/routes/Exercises.js
const jwt = require("jsonwebtoken");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const createDbConnection = require("../database");

module.exports = (app) => {
  // Get all exercises
  app.get("/api/exercises", cookieJwtAuth, async (req, res) => {
    let db;
    try {
      db = await createDbConnection();
      const sql = `SELECT * FROM exercises`;
      const [results] = await db.query(sql);
      return res.json(results);
    } catch (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    } finally {
      if (db) await db.end(); // Ensure the connection is closed
    }
  });
};
