//attendence
import express from "express";
import db from "../db.js";

const router = express.Router();

// ✅ Get all registrations for a specific event
router.get("/event/:eventId", (req, res) => {
  const { eventId } = req.params;
  const sql = `
    SELECT studentName, studentEmail, studentDept, regDate
    FROM registrations
    WHERE eventId = ?
  `;

  db.query(sql, [eventId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching registrations:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

export default router;
