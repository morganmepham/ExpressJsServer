const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const createDbConnection = require("../database");

module.exports = (app) => {
  // Login endpoint
  app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    let db;
    try {
      db = await createDbConnection();
      const sql = `SELECT * FROM users WHERE username = ?`;
      const [results] = await db.query(sql, [username]);

      if (results.length === 0) {
        return res.status(403).json({ error: "Invalid login" });
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(403).json({ error: "Invalid login" });
      }

      delete user.password;
      const token = jwt.sign(user, process.env.MY_SECRET, { expiresIn: "1h" });

      res.cookie("token", token);
      return res.status(200).json({
        message: "Authenticated",
        jwt: token,
      });
    } catch (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    } finally {
      if (db) await db.end(); // Ensure the connection is closed
    }
  });

  // Logout endpoint
  app.post("/logout", cookieJwtAuth, async (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out" });
  });

  // Change Password endpoint
  app.post("/change-password", cookieJwtAuth, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const userId = req.user.id;

    let db;
    try {
      db = await createDbConnection();
      const sql = `UPDATE users SET password = ? WHERE id = ?`;
      const [results] = await db.query(sql, [hashedPassword, userId]);

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ message: "Password Changed" });
    } catch (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    } finally {
      if (db) await db.end(); // Ensure the connection is closed
    }
  });
};
