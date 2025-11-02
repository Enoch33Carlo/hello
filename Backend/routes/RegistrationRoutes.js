import express from "express";
import db from "../db.js"; // make sure db.js exports a working MySQL connection

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { eventId, eventName, studentName, studentEmail, studentDept } = req.body;

    console.log("Incoming registration:", req.body);

    if (!eventId || !eventName || !studentName || !studentEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await db.query(
      "INSERT INTO registrations (eventId, eventName, studentName, studentEmail, studentDept) VALUES (?, ?, ?, ?, ?)",
      [eventId, eventName, studentName, studentEmail, studentDept]
    );

    res.status(201).json({ message: "✅ Registration saved successfully" });
  } catch (error) {
    console.error("❌ Error inserting registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
