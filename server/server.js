const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const https = require("https");
const http = require("http");
const fs = require("fs");

const app = express();

// Middleware
app.use(logger("dev"));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// API Routes
const setupAuthRoute = require("./routes/Auth");
const setupUsersRoute = require("./routes/Users");
const setupTemplates = require("./routes/Templates");
const setupWorkouts = require("./routes/Workouts");
const setupExercises = require("./routes/Exercises");

setupAuthRoute(app);
setupUsersRoute(app);
setupTemplates(app);
setupWorkouts(app);
setupExercises(app);

// Catch-all handler for client-side routing
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// HTTPS server options
const httpsOptions = {
  key: fs.readFileSync("/home/default_admin/certs/private.key", (err) => {
    if (err) console.error("Error reading private key:", err);
  }),
  cert: fs.readFileSync("/home/default_admin/certs/certificate.crt", (err) => {
    if (err) console.error("Error reading certificate:", err);
  }),
};

// Create HTTPS server
https.createServer(httpsOptions, app).listen(443, () => {
  console.log("HTTPS Server running on port 443");
});

// Create HTTP server for redirection
http
  .createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  })
  .listen(80, () => {
    console.log("HTTP Server running on port 80 and redirecting to HTTPS");
  });
