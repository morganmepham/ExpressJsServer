const jwt = require("jsonwebtoken");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const userJSON = require("../assets/user.json");
const mysql = require("mysql2");
const fs = require("fs");
const bcrypt = require("bcrypt");

function createDbConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "P@ssword1234",
    database: "gymApp",
  });
}

module.exports = (app) => {
  app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
    if (!username || !password) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    // const db = mysql.createConnection({
    //   host: "localhost",
    //   user: "root",
    //   password: "P@ssword1234",
    //   database: "gymApp",
    // });
    const db = createDbConnection();

    // Use parameterized query to prevent SQL injection
    const sql = `SELECT * FROM users WHERE username = ?`;

    db.query(sql, [username], async (err, results) => {
      if (err) {
        db.end(); // Ensure the connection is closed on error
        return res.status(500).json({ error: "Database query failed" });
      }

      if (results.length === 0) {
        db.end(); // Ensure the connection is closed
        return res.status(403).json({ error: "Invalid login1" });
      }

      const user = results[0];

      // Compare password (assuming you use bcrypt for hashing passwords)
      // const passwordMatch = await bcrypt.compare(password, user.password);

      if (password !== user.password) {
        db.end(); // Ensure the connection is closed
        return res.status(403).json({ error: "Invalid login2" });
      }

      // Remove sensitive information
      delete user.password;

      // Generate a JWT token
      const token = jwt.sign(user, process.env.MY_SECRET, { expiresIn: "1h" });

      // Set the token as a cookie
      res.cookie("token", token);

      db.end(); // Ensure the connection is closed

      return res.status(200).json({
        message: "Authenticated",
        jwt: token,
      });
    });
  });

  app.post("/logout", cookieJwtAuth, async (req, res) => {
    res.clearCookie("token");
    res.status(200);
    res.send("Logged out");
  });
  //   const { newPassword } = req.body;
  //   if (!newPassword) {
  //     return res.status(400).json({ error: "Invalid Body" });
  //   }

  //   fs.readFile(
  //     "../server/assets/user.json",
  //     "utf8",
  //     function readFileCallback(err, data) {
  //       if (err) {
  //         console.log(err);
  //         res.status(500);
  //         res.send("Server Error");
  //       } else {
  //         obj = JSON.parse(data); //now it an object
  //         obj.password = newPassword; //add some data
  //         json = JSON.stringify(obj); //convert it back to json
  //         fs.writeFile(
  //           "../server/assets/user.json",
  //           json,
  //           "utf8",
  //           function (err) {
  //             if (err) {
  //               res.status(500);
  //               res.send("Server Error");
  //               throw err;
  //             }
  //           }
  //         );
  //       }
  //     }
  //   );

  //   return res.status(200).json({
  //     Mesage: "Changed Password",
  //   });
  // });

  app.post("/change-password", cookieJwtAuth, async (req, res) => {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    // Extract user ID from the JWT token (assuming the user ID is stored in the token)
    const userId = req.user.id; // Assuming your `cookieJwtAuth` middleware attaches the user to `req.user`

    // Hash the new password

    const db = createDbConnection();

    const sql = `UPDATE users SET password = ? WHERE id = ?`;

    db.query(sql, [newPassword, userId], (err, results) => {
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
        message: "Password Changed",
      });
    });
  });
};
