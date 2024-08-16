const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const https = require("https");
const http = require("http");
const fs = require("fs");
const { Pool } = require("pg");

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

const pool = new Pool({
  user: "your_username",
  host: "your_host",
  database: "your_database",
  password: "your_password",
  port: 5432,
});

// Function to check if a table exists
async function tableExists(tableName) {
  const result = await pool.query(
    `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_name = $1
    );
  `,
    [tableName]
  );
  return result.rows[0].exists;
}

// Function to create tables
async function createTables() {
  try {
    // Read the SQL script
    const sqlScript = fs.readFileSync(
      path.join(__dirname, "create_tables.sql"),
      "utf8"
    );

    // Split the script into individual statements
    const statements = sqlScript
      .split(";")
      .filter((stmt) => stmt.trim() !== "");

    // Execute each statement
    for (let statement of statements) {
      await pool.query(statement);
    }

    console.log("All tables created successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
}

// Function to initialize the database
async function initializeDatabase() {
  const tablesToCheck = [
    "Users",
    "Friends",
    "Messages",
    "Posts",
    "Likes",
    "Comments",
    "Workouts",
    "WorkoutExercises",
    "WorkoutTemplates",
    "TemplateExercises",
    "Achievements",
    "Macros",
    "Notifications",
    "LikedPosts",
    "Reports",
  ];

  for (let table of tablesToCheck) {
    if (!(await tableExists(table))) {
      console.log(`Table ${table} does not exist. Creating all tables...`);
      await createTables();
      break;
    }
  }
}

// Initialize the database when the server starts
initializeDatabase().catch(console.error);

// HTTPS server options
// const httpsOptions = {
//   key: fs.readFileSync("/home/default_admin/certs/private.key", (err) => {
//     if (err) console.error("Error reading private key:", err);
//   }),
//   cert: fs.readFileSync("/home/default_admin/certs/certificate.crt", (err) => {
//     if (err) console.error("Error reading certificate:", err);
//   }),
// };

const httpsOptionsLaptop = {
  key: fs.readFileSync(
    "C:/Users/morga/Documents/cert/localhost-key.pem",
    (err) => {
      if (err) console.error("Error reading private key:", err);
    }
  ),
  cert: fs.readFileSync(
    "C:/Users/morga/Documents/cert/localhost-cert.pem",
    (err) => {
      if (err) console.error("Error reading certificate:", err);
    }
  ),
};

// Create HTTPS server
https.createServer(httpsOptionsLaptop, app).listen(443, () => {
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
