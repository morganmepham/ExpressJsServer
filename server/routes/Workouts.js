const jwt = require("jsonwebtoken");
const { cookieJwtAuth } = require("../middleware/cookieJwtAuth");
const createDbConnection = require("../database");

module.exports = (app) => {
  // Create a new workout
  app.post("/api/workouts", cookieJwtAuth, async (req, res) => {
    const { name, exercises } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    const userId = decoded.id;

    // Validate input data
    if (!name || !Array.isArray(exercises)) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    let connection;
    try {
      connection = await createDbConnection();

      // Start a transaction
      await connection.beginTransaction();

      // Insert the workout
      const [workoutResult] = await connection.query(
        "INSERT INTO workouts (user_id, name) VALUES (?, ?)",
        [userId, name]
      );
      const workoutId = workoutResult.insertId;

      // Insert workout exercises
      for (const exercise of exercises) {
        const { exercise_id, sets, reps, weight } = exercise;

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

        // Insert into workout_exercises
        await connection.query(
          "INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight) VALUES (?, ?, ?, ?, ?)",
          [workoutId, exercise_id, sets, reps, weight]
        );
      }

      // Commit the transaction
      await connection.commit();

      res.status(201).json({
        message: "Workout created",
        workoutId: workoutId,
      });
    } catch (error) {
      // If an error occurs, rollback the transaction
      if (connection) await connection.rollback();
      console.error("Database query failed:", error);
      res.status(500).json({ error: "Failed to create workout" });
    } finally {
      if (connection) await connection.end(); // Close the database connection
    }
  });

  // Get all workouts for a user
  app.get("/api/workouts", cookieJwtAuth, async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    const userId = decoded.id;

    let db;
    try {
      db = await createDbConnection();
      const sql = `SELECT * FROM workouts WHERE user_id = ? ORDER BY date DESC`;
      const [results] = await db.query(sql, [userId]);
      return res.json(results);
    } catch (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    } finally {
      if (db) await db.end(); // Ensure the connection is closed
    }
  });

  // Get details of a specific workout
  app.post("/api/workout", cookieJwtAuth, async (req, res) => {
    const { workoutId } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    const userId = decoded.id;

    if (!workoutId) {
      return res.status(400).json({ error: "Workout ID is required" });
    }

    let db;
    try {
      db = await createDbConnection();
      const sql = `
        SELECT w.id AS workout_id, w.name, w.date, we.exercise_id, e.name AS exercise_name, we.sets, we.reps, we.weight
        FROM workouts w
        LEFT JOIN workout_exercises we ON w.id = we.workout_id
        LEFT JOIN exercises e ON we.exercise_id = e.id
        WHERE w.id = ? AND w.user_id = ?
      `;

      const [results] = await db.query(sql, [workoutId, userId]);

      if (results.length === 0) {
        return res.status(404).json({ error: "Workout not found" });
      }

      const workout = {
        workoutId: results[0].workout_id,
        name: results[0].name,
        date: results[0].date,
        exercises: results.map((row) => ({
          exercise_id: row.exercise_id,
          exercise_name: row.exercise_name,
          sets: row.sets,
          reps: row.reps,
          weight: row.weight,
        })),
      };

      return res.json(workout);
    } catch (err) {
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    } finally {
      if (db) await db.end(); // Ensure the connection is closed
    }
  });

  // Delete a workout
  app.delete("/api/workout", cookieJwtAuth, async (req, res) => {
    const { workoutId } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    const userId = decoded.id;

    if (!workoutId) {
      return res.status(400).json({ error: "Workout ID is required" });
    }

    let connection;
    try {
      connection = await createDbConnection();

      // Start a transaction
      await connection.beginTransaction();

      // Delete related workout exercises first
      await connection.query(
        "DELETE FROM workout_exercises WHERE workout_id = ?",
        [workoutId]
      );

      // Delete the workout
      const [results] = await connection.query(
        "DELETE FROM workouts WHERE id = ? AND user_id = ?",
        [workoutId, userId]
      );

      if (results.affectedRows === 0) {
        await connection.rollback();
        return res
          .status(404)
          .json({ error: "Workout not found or not authorized" });
      }

      // Commit the transaction
      await connection.commit();

      return res.status(200).json({ message: "Workout deleted" });
    } catch (err) {
      if (connection) await connection.rollback();
      console.error("Database query failed:", err);
      return res.status(500).json({ error: "Database query failed" });
    } finally {
      if (connection) await connection.end(); // Ensure the connection is closed
    }
  });

  // Update a workout
  app.put("/api/workout", cookieJwtAuth, async (req, res) => {
    const { workoutId, name, exercises } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.MY_SECRET);
    const userId = decoded.id;

    // Validate input data
    if (!workoutId || !name || !Array.isArray(exercises)) {
      return res.status(400).json({ error: "Invalid Body" });
    }

    let connection;
    try {
      connection = await createDbConnection();

      // Start a transaction
      await connection.beginTransaction();

      // Update the workout
      const [updateResult] = await connection.query(
        "UPDATE workouts SET name = ? WHERE id = ? AND user_id = ?",
        [name, workoutId, userId]
      );

      if (updateResult.affectedRows === 0) {
        await connection.rollback();
        return res
          .status(404)
          .json({ error: "Workout not found or not authorized" });
      }

      // Delete existing workout exercises for the workout
      await connection.query(
        "DELETE FROM workout_exercises WHERE workout_id = ?",
        [workoutId]
      );

      // Insert updated workout exercises
      for (const exercise of exercises) {
        const { exercise_id, sets, reps, weight } = exercise;

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

        // Insert into workout_exercises
        await connection.query(
          "INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight) VALUES (?, ?, ?, ?, ?)",
          [workoutId, exercise_id, sets, reps, weight]
        );
      }

      // Commit the transaction
      await connection.commit();

      res.status(200).json({ message: "Workout updated successfully" });
    } catch (error) {
      // If an error occurs, rollback the transaction
      if (connection) await connection.rollback();
      console.error("Database query failed:", error);
      res.status(500).json({ error: "Failed to update workout" });
    } finally {
      if (connection) await connection.end(); // Close the database connection
    }
  });
};
