const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
app.use(express.json());
const setupAuthRoute = require("./routes/Auth");
const PORT = 3000;

const logger = require("morgan");
app.use(logger("tiny"));
app.use(express.static(path.join(__dirname, "../frontend/dist")));

var cors = require("cors");
app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

setupAuthRoute(app);

app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "../frontend/dist/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
