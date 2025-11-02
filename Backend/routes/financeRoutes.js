import express from "express";
import db from "../db.js";

const router = express.Router();

// ✅ Get all finance data
router.get("/", (req, res) => {
  const sql = "SELECT * FROM finance ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching finance data:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ Update finance record
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { cashCollected, onlineCollected } = req.body;

  const sql = "UPDATE finance SET cashCollected = ?, onlineCollected = ? WHERE id = ?";
  db.query(sql, [cashCollected, onlineCollected, id], (err, result) => {
    if (err) {
      console.error("❌ Error updating finance:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true, message: "Finance record updated successfully" });
  });
});

export default router;
