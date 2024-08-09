const jwt = require("jsonwebtoken");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const createDbConnection = require("../database");

module.exports = (app) => {
  // Get Specific Template
  app.post("/api/template", cookieJwtAuth, async (req, res) => {
    const { templateId } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    const userId = decoded.id;

    if (!templateId) {
      return res.status(400).json({ error: "Template ID is required" });
    }

    let db;
    try {
      db = await createDbConnection();
      const sql = `
        SELECT wt.id AS template_id, wt.name AS template_name, 
               e.id AS exercise_id, te.sets, te.reps, te.order_in_template
        FROM workout_templates wt
        LEFT JOIN template_exercises te ON wt.id = te.template_id
        LEFT JOIN exercises e ON te.exercise_id = e.id
        WHERE wt.id = ? AND wt.user_id = ?
        ORDER BY te.order_in_template
      `;

      const [results] = await db.query(sql, [templateId, userId]);

      if (results.length === 0) {
        return res.status(404).json({ error: "Template not found" });
      }

      // Construct the response object with both template_name and template_id
      const template = {
        templateId: results[0].template_id,
        templateName: results[0].template_name,
        exercises: results
          .map((row) => ({
            exercise_id: row.exercise_id,
            sets: row.sets,
            reps: row.reps,
            order_in_template: row.order_in_template,
          }))
          .filter((exercise) => exercise.exercise_id !== null),
      };

      return res.json(template);
    } catch (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    } finally {
      if (db) await db.end(); // Ensure the connection is closed
    }
  });
  // Create a new workout template for a user with exercises
  app.post("/api/templates", cookieJwtAuth, async (req, res) => {
    const { name, description, exercises } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    const userId = decoded.id;

    // Validate input data
    if (!name || !description || !Array.isArray(exercises)) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    let connection;
    try {
      connection = await createDbConnection();

      // Start a transaction
      await connection.beginTransaction();

      // Insert the template
      const [templateResult] = await connection.query(
        "INSERT INTO workout_templates (name, description, user_id) VALUES (?, ?, ?)",
        [name, description, userId]
      );
      const templateId = templateResult.insertId;

      // Insert exercises
      for (const exercise of exercises) {
        const { exercise_id, sets, reps } = exercise;

        // Check if exercise exists in the exercises table
        const [exerciseResult] = await connection.query(
          "SELECT id FROM exercises WHERE id = ?",
          [exercise_id]
        );

        if (exerciseResult.length === 0) {
          await connection.rollback();
          return res
            .status(400)
            .json({ error: `Exercise with id ${exercise_id} does not exist` });
        }

        // Insert into template_exercises
        await connection.query(
          "INSERT INTO template_exercises (template_id, exercise_id, sets, reps, order_in_template) VALUES (?, ?, ?, ?, ?)",
          [templateId, exercise_id, sets, reps, exercises.indexOf(exercise) + 1]
        );
      }

      // Commit the transaction
      await connection.commit();

      res.status(201).json({
        message: "Workout template created",
        templateId: templateId,
      });
    } catch (error) {
      // If an error occurs, rollback the transaction
      if (connection) await connection.rollback();
      console.error("Database query failed:", error);
      res.status(500).json({ error: "Failed to create workout template" });
    } finally {
      if (connection) await connection.end(); // Close the database connection
    }
  });

  // Get all templates for a user
  app.get("/api/templates", cookieJwtAuth, async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    const userId = decoded.id;

    let db;
    try {
      db = await createDbConnection();
      const sql = `
        SELECT * FROM workout_templates 
        WHERE user_id = ? 
        ORDER BY created_at DESC
      `;
      const [results] = await db.query(sql, [userId]);
      return res.json(results);
    } catch (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    } finally {
      if (db) await db.end(); // Ensure the connection is closed
    }
  });

  // Delete a template
  app.delete("/api/template", cookieJwtAuth, async (req, res) => {
    const { templateId } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    const userId = decoded.id;

    if (!templateId) {
      return res.status(400).json({ error: "Template ID is required" });
    }

    let connection;
    try {
      connection = await createDbConnection();

      // Start a transaction
      await connection.beginTransaction();

      // Delete related exercises first
      await connection.query(
        "DELETE FROM template_exercises WHERE template_id = ?",
        [templateId]
      );

      // Delete the template
      const [results] = await connection.query(
        "DELETE FROM workout_templates WHERE id = ? AND user_id = ?",
        [templateId, userId]
      );

      if (results.affectedRows === 0) {
        await connection.rollback();
        return res
          .status(404)
          .json({ error: "Template not found or not authorized" });
      }

      // Commit the transaction
      await connection.commit();

      return res.status(200).json({ message: "Template deleted" });
    } catch (err) {
      if (connection) await connection.rollback();
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    } finally {
      if (connection) await connection.end(); // Ensure the connection is closed
    }
  });

  // Update a template
  app.put("/api/template", cookieJwtAuth, async (req, res) => {
    const { templateId, name, description, exercises } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    const userId = decoded.id;

    // Validate input data
    if (!templateId || !name || !description || !Array.isArray(exercises)) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    let connection;
    try {
      connection = await createDbConnection();

      // Start a transaction
      await connection.beginTransaction();

      // Update the template
      const [updateResult] = await connection.query(
        "UPDATE workout_templates SET name = ?, description = ? WHERE id = ? AND user_id = ?",
        [name, description, templateId, userId]
      );

      if (updateResult.affectedRows === 0) {
        await connection.rollback();
        return res
          .status(404)
          .json({ error: "Template not found or not authorized" });
      }

      // Delete existing exercises for the template
      await connection.query(
        "DELETE FROM template_exercises WHERE template_id = ?",
        [templateId]
      );

      // Insert updated exercises
      for (const exercise of exercises) {
        const { exercise_id, sets, reps } = exercise;

        // Check if exercise exists in the exercises table
        const [exerciseResult] = await connection.query(
          "SELECT id FROM exercises WHERE id = ?",
          [exercise_id]
        );

        if (exerciseResult.length === 0) {
          await connection.rollback();
          return res
            .status(400)
            .json({ error: `Exercise with id ${exercise_id} does not exist` });
        }

        // Insert into template_exercises
        await connection.query(
          "INSERT INTO template_exercises (template_id, exercise_id, sets, reps, order_in_template) VALUES (?, ?, ?, ?, ?)",
          [templateId, exercise_id, sets, reps, exercises.indexOf(exercise) + 1]
        );
      }

      // Commit the transaction
      await connection.commit();

      res.status(200).json({ message: "Template updated successfully" });
    } catch (error) {
      // If an error occurs, rollback the transaction
      if (connection) await connection.rollback();
      console.error("Database query failed:", error);
      res.status(500).json({ error: "Failed to update workout template" });
    } finally {
      if (connection) await connection.end(); // Close the database connection
    }
  });
};
