import express from "express";
import db from "../db.js";

const router = express.Router();

// ✅ Fetch all events
router.get("/", (req, res) => {
  const sql = "SELECT id, title, category, date, time, location, venue, payment, image, description FROM events ORDER BY createdAt DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching events:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // prepend your image path if stored as just filename
    const formatted = results.map(ev => ({
      ...ev,
      image: ev.image ? `http://localhost:5000/uploads/${ev.image}` : ""
    }));

    res.json(formatted);
  });
});

// ✅ Delete event by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM events WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting event:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Event deleted successfully" });
  });
});

export default router;
