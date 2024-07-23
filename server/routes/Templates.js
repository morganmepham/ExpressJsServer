const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const createDbConnection = require("../database");

module.exports = (app) => {
  // Get Specific Template
  app.post("/template", cookieJwtAuth, async (req, res) => {
    const { templateId } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    const userId = decoded.id;

    if (!templateId) {
      return res.status(400).json({ error: "Template ID is required" });
    }

    const db = createDbConnection();
    const sql = `
      SELECT wt.id AS template_id, wt.name AS template_name, 
             e.name AS exercise_name, te.sets, te.reps, te.order_in_template
      FROM workout_templates wt
      LEFT JOIN template_exercises te ON wt.id = te.template_id
      LEFT JOIN exercises e ON te.exercise_id = e.id
      WHERE wt.id = ? AND wt.user_id = ?
      ORDER BY te.order_in_template
    `;

    db.query(sql, [templateId, userId], (err, results) => {
      db.end(); // Ensure the connection is closed
      if (err) {
        console.error("Database query failed:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Template not found" });
      }

      const template = {
        templateName: results[0].template_name,
        templateId: results[0].template_id,
        exercises: results
          .map((row) => ({
            exercise_name: row.exercise_name,
            sets: row.sets,
            reps: row.reps,
            order_in_template: row.order_in_template,
          }))
          .filter((exercise) => exercise.exercise_name !== null),
      };

      return res.json(template);
    });
  });
  // Create a new workout template for a user with exercises
  app.post("/templates", cookieJwtAuth, async (req, res) => {
    const { name, description, exercises } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    const userId = decoded.id;

    let db;
    try {
      db = await createDbConnection();

      // Start a transaction
      await db.beginTransaction();

      // Insert the template
      const [templateResult] = await db.query(
        "INSERT INTO workout_templates (name, description, user_id) VALUES (?, ?, ?)",
        [name, description, userId]
      );
      const templateId = templateResult.insertId;

      // Insert exercises
      for (let i = 0; i < exercises.length; i++) {
        const { exercise_name, sets, reps } = exercises[i];

        // Check if exercise exists, if not, create it
        let [exerciseResult] = await db.query(
          "SELECT id FROM exercises WHERE name = ?",
          [exercise_name]
        );

        let exerciseId;
        if (exerciseResult.length === 0) {
          [exerciseResult] = await db.query(
            "INSERT INTO exercises (name) VALUES (?)",
            [exercise_name]
          );
          exerciseId = exerciseResult.insertId;
        } else {
          exerciseId = exerciseResult[0].id;
        }

        // Insert into template_exercises
        await db.query(
          "INSERT INTO template_exercises (template_id, exercise_id, sets, reps, order_in_template) VALUES (?, ?, ?, ?, ?)",
          [templateId, exerciseId, sets, reps, i + 1]
        );
      }

      // Commit the transaction
      await db.commit();

      res.status(201).json({
        message: "Workout template created",
        templateId: templateId,
      });
    } catch (error) {
      // If an error occurs, rollback the transaction
      if (db) await db.rollback();
      console.error("Database query failed:", error);
      res.status(500).json({ error: "Failed to create workout template" });
    } finally {
      if (db) await db.end(); // Close the database connection
    }
  });

  // Get all templates for a user
  app.get("/templates", cookieJwtAuth, async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    const userId = decoded.id;

    const db = createDbConnection();
    const sql = `SELECT * FROM workout_templates WHERE user_id = ?`;

    db.query(sql, [userId], (err, results) => {
      db.end();
      if (err) {
        console.error("Database query failed:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      return res.json(results);
    });
  });
};
