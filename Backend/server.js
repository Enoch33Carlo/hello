import express from "express";
import cors from "cors";
import { openDb } from "./database.js";
import dotenv from "dotenv";
import fetch from "node-fetch";
import geminiRoute from "./routes/geminiRoute.js";

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", geminiRoute);

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
// 🔮 POST /api/gemini-insight — Generate AI analytics for report
app.post("/api/gemini-insight", async (req, res) => {
  const { reportData } = req.body;

  if (!reportData) {
    return res.status(400).json({ error: "Missing report data" });
  }

  try {
    const response = await fetch(process.env.GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Analyze this event report and give insights in 3 paragraphs:\n
                Title: ${reportData.title}
                Category: ${reportData.category}
                Date: ${reportData.date}
                Total Seats: ${reportData.totalSeats}
                Registrations: ${reportData.registrations}
                Guests: ${reportData.guests}
                Earnings: ₹${reportData.earnings}
                Total Students Attended: ${reportData.totalStudents}
                Total Teams: ${reportData.totalTeams}\n
                Provide AI insights about success, engagement level, and improvement suggestions.`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const insights =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No insights available.";

    res.json({ insights });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});



const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
