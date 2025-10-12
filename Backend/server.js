import express from "express";
import cors from "cors";
import { openDb } from "./database.js";

const app = express();
app.use(cors());
app.use(express.json());

// POST /api/register — Save registration
app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, department, message, eventTitle } = req.body;

    if (!fullName || !email || !eventTitle) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const db = await openDb();
    await db.run(
      "INSERT INTO registrations (fullName, email, department, message, eventTitle, registeredAt) VALUES (?, ?, ?, ?, ?, ?)",
      [fullName, email, department, message, eventTitle, new Date().toISOString()]
    );

    res.status(201).json({ success: true, message: "Registered successfully!" });
  } catch (err) {
    console.error("Database insert error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/registrations — Fetch all registrations
app.get("/api/registrations", async (req, res) => {
  try {
    const db = await openDb();
    const registrations = await db.all("SELECT * FROM registrations ORDER BY id DESC");
    res.json(registrations);
  } catch (err) {
    console.error("Database read error:", err);
    res.status(500).json({ error: "Server error" });
  }
  });
app.get("/api/registrations", async (req, res) => {
  try {
    const db = await dbPromise;
    const rows = await db.all("SELECT * FROM registrations");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database fetch error" });
  }
});



const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
