const jwt = require("jsonwebtoken");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const userJSON = require("../assets/user.json");
const fs = require("fs");

const getUser = async () => {
  return { password: userJSON.password, username: userJSON.username };
};

module.exports = (app) => {
  app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    const user = await getUser();

    if (user.username !== username) {
      return res.status(403).json({
        error: "invalid login",
      });
    }

    if (user.password !== password) {
      return res.status(403).json({
        error: "invalid login",
      });
    }

    delete user.password;

    const token = jwt.sign(user, process.env.MY_SECRET, { expiresIn: "1h" });

    res.cookie("token", token);

    return res.status(200).json({
      Mesage: "Authenticated",
      jwt: token,
    });
  });

  app.post("/logout", cookieJwtAuth, async (req, res) => {
    res.clearCookie("token");
    res.status(200);
    res.send("Logged out");
  });

  app.post("/change-password", cookieJwtAuth, async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    fs.readFile(
      "../server/assets/user.json",
      "utf8",
      function readFileCallback(err, data) {
        if (err) {
          console.log(err);
          res.status(500);
          res.send("Server Error");
        } else {
          obj = JSON.parse(data); //now it an object
          obj.password = newPassword; //add some data
          json = JSON.stringify(obj); //convert it back to json
          fs.writeFile(
            "../server/assets/user.json",
            json,
            "utf8",
            function (err) {
              if (err) {
                res.status(500);
                res.send("Server Error");
                throw err;
              }
            }
          );
        }
      }
    );

    return res.status(200).json({
      Mesage: "Changed Password",
    });
  });
};
