import express from "express";
import db from "../db.js";

const router = express.Router();

/**
 * ✅ POST /api/register
 * Add a new student registration for an event
 */
router.post("/", (req, res) => {
  const { eventId, eventName, studentName, studentEmail, studentDept } = req.body;

  // Check required fields
  if (!eventId || !eventName || !studentName || !studentEmail) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const sql = `
    INSERT INTO registrations (eventId, eventName, studentName, studentEmail, studentDept)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [eventId, eventName, studentName, studentEmail, studentDept], (err, result) => {
    if (err) {
      console.error("❌ Error inserting registration:", err);
      return res.status(500).json({ error: "Database error." });
    }

    res.json({ message: "✅ Registration successful!" });
  });
});

/**
 * ✅ GET /api/register/event/:eventId
 * Fetch all registrations for a specific event
 */
router.get("/event/:eventId", (req, res) => {
  const { eventId } = req.params;

  const sql = `
    SELECT id, eventName, studentName, studentEmail, studentDept, regDate
    FROM registrations
    WHERE eventId = ?
    ORDER BY regDate DESC
  `;

  db.query(sql, [eventId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching registrations:", err);
      return res.status(500).json({ error: "Database error." });
    }

    res.json(results);
  });
});

/**
 * ✅ Optional: GET /api/register
 * Fetch all registrations (useful for admin)
 */
router.get("/", (req, res) => {
  const sql = "SELECT * FROM registrations ORDER BY regDate DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching all registrations:", err);
      return res.status(500).json({ error: "Database error." });
    }

    res.json(results);
  });
});

export default router;
