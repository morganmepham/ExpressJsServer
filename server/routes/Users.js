const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const createDbConnection = require("../database");

module.exports = (app) => {
  // POST Request - Create User
  app.post("/users", async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input data
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let db;
    try {
      db = await createDbConnection();
      const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
      const [results] = await db.query(sql, [username, email, hashedPassword]);

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
    } catch (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    } finally {
      if (db) await db.end(); // Ensure the connection is closed
    }
  });

  // GET Request - Get All Users
  app.get("/users", cookieJwtAuth, async (req, res) => {
    let db;
    try {
      db = await createDbConnection();
      const sql = "SELECT id, username, email FROM users";
      const [data] = await db.query(sql);
      return res.json(data);
    } catch (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    } finally {
      if (db) await db.end(); // Ensure the connection is closed
    }
  });

  // GET Request - Get Current User
  app.get("/this-user", cookieJwtAuth, async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    let db;
    try {
      db = await createDbConnection();
      const sql = `SELECT id, username, email FROM users WHERE username = ?`;
      const [data] = await db.query(sql, [decoded.username]);
      if (data.length === 0)
        return res.status(404).json({ error: "User not found" });
      return res.json(data[0]);
    } catch (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    } finally {
      if (db) await db.end(); // Ensure the connection is closed
    }
  });

  // DELETE Request - Delete User
  app.delete("/users", cookieJwtAuth, async (req, res) => {
    const { id: userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    let db;
    try {
      db = await createDbConnection();
      const sql = `DELETE FROM users WHERE id = ?`;
      const [results] = await db.query(sql, [userId]);

      // Check if any row was affected
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({
        message: "User Deleted",
      });
    } catch (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    } finally {
      if (db) await db.end(); // Ensure the connection is closed
    }
  });

  // PUT Request - Update User with JWT Update
  app.put("/users", cookieJwtAuth, async (req, res) => {
    const { id: userId, username, email, password } = req.body;

    // Validate input data
    if (!userId || !username || !email) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    let db;
    try {
      db = await createDbConnection();
      let sql;
      let params;

      // Check if password needs to be updated
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        sql = `UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?`;
        params = [username, email, hashedPassword, userId];
      } else {
        sql = `UPDATE users SET username = ?, email = ? WHERE id = ?`;
        params = [username, email, userId];
      }

      const [results] = await db.query(sql, params);

      // Check if any row was affected
      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "User not found or no change in data" });
      }

      const updatedUser = { id: userId, username, email };
      const token = jwt.sign(updatedUser, process.env.MY_SECRET, {
        expiresIn: "1h",
      });

      // Send the new JWT token as a cookie
      res.cookie("token", token);

      return res.status(200).json({
        message: "User Updated",
        user: updatedUser,
        jwt: token,
      });
    } catch (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    } finally {
      if (db) await db.end(); // Ensure the connection is closed
    }
  });
};
