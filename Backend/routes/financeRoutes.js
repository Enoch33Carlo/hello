import express from "express";
import db from "../db.js";

const router = express.Router();

// ✅ Add new finance record
router.post("/add", (req, res) => {
  const { eventId, eventName, cashCollected, onlineCollected } = req.body;

  // Debug log (optional)
  console.log("Received data:", req.body);

  // Basic validation
  if (cashCollected == null || onlineCollected == null) {
    return res.status(400).json({ error: "Both cashCollected and onlineCollected are required." });
  }

  const sql = `
    INSERT INTO finance (eventId, eventName, cashCollected, onlineCollected)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [eventId || null, eventName || null, cashCollected, onlineCollected], (err, result) => {
    if (err) {
      console.error("❌ Error inserting finance data:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ success: true, message: "✅ Finance data added successfully!" });
  });
});

export default router;
