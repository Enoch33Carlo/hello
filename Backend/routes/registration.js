import express from "express";
import db from "../config/db.js"; // your MySQL connection
const router = express.Router();

// Get all registrations for a specific event
router.get("/event/:eventId", async (req, res) => {
  const { eventId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT studentName, studentEmail, studentDept, regDate FROM registrations WHERE eventId = ?",
      [eventId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
