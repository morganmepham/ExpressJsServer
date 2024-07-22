const jwt = require("jsonwebtoken");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const createDbConnection = require("../database");

module.exports = (app) => {
  app.post("/users", async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input data
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const db = createDbConnection();

    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

    db.query(sql, [username, email, hashedPassword], (err, results) => {
      db.end(); // Ensure the connection is closed

      if (err) {
        console.error("Database query failed:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      // Get the inserted user ID
      const userId = results.insertId;

      // Create a new JWT token with the new user details
      const newUser = { id: userId, username, email };
      const token = jwt.sign(newUser, process.env.MY_SECRET, {
        expiresIn: "1h",
      });

      // Send the new JWT token as a cookie
      res.cookie("token", token);

      return res.status(201).json({
        message: "User Created",
        user: newUser,
        jwt: token,
      });
    });
  });

  app.get("/users", cookieJwtAuth, async (req, res) => {
    const db = createDbConnection();

    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

  app.get("/this-user", cookieJwtAuth, async (req, res) => {
    const db = createDbConnection();
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);

    const sql = `SELECT * FROM users WHERE username = "${decoded.username}"`;
    db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

  app.delete("/users", cookieJwtAuth, async (req, res) => {
    const { id: userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    const db = createDbConnection();

    const sql = `DELETE FROM users WHERE id = ?`;

    db.query(sql, [userId], (err, results) => {
      db.end(); // Ensure the connection is closed

      if (err) {
        console.error("Database query failed:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      // Check if any row was affected
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        message: "User Deleted",
      });
    });
  });

  app.put("/users", cookieJwtAuth, async (req, res) => {
    const { id: userId, username, email } = req.body;

    // Validate input data
    if (!userId || !username || !email) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    const db = createDbConnection();

    const sql = `UPDATE users SET username = ?, email = ? WHERE id = ?`;

    db.query(sql, [username, email, userId], (err, results) => {
      db.end(); // Ensure the connection is closed

      if (err) {
        console.error("Database query failed:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      // Check if any row was affected
      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "User not found or no change in data" });
      }

      // Create a new JWT token with the updated user details
      const updatedUser = { id: userId, username, email };
      const token = jwt.sign(updatedUser, process.env.MY_SECRET, {
        expiresIn: "1h",
      });

      // Send the new JWT token as a cookie
      res.cookie("token", token);

      return res.status(200).json({
        message: "User Updated",
        jwt: token,
      });
    });
  });
};
