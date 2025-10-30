// ✅ server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import geminiRoute from "./routes/geminiRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "M@rtes2121",
  database: "AI_Campus",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// ✅ Login Route
app.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND role = ?";
  db.query(sql, [email, role], async (err, results) => {
    if (err) return res.status(500).send("Database error");
    if (results.length === 0) return res.status(401).send("User not found");

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(401).send("Invalid password");

    res.json({
      message: "Login successful",
      user: { id: user.id, firstName: user.firstName, role: user.role },
    });
  });
});

// ✅ Registration Route
app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const checkQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkQuery, [email], async (err, results) => {
    if (err) return res.status(500).send("Database error");
    if (results.length > 0) return res.status(400).send("Email already registered");

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (firstName, lastName, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [firstName, lastName, email, hashedPassword, role], (err) => {
      if (err) {
        console.error("❌ Error registering user:", err);
        return res.status(500).send("Error registering user");
      }
      console.log("✅ User registered successfully:", email);
      res.status(200).send("Registration successful!");
    });
  });
});

// ✅ Feedback Form Route
app.post("/api/feedback", (req, res) => {
  const { fullName, email, department, message, eventTitle } = req.body;

  if (!fullName || !email || !eventTitle) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO feedback (fullName, email, department, message, eventTitle, submittedAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [fullName, email, department, message, eventTitle, new Date()], (err) => {
    if (err) {
      console.error("❌ Feedback insert error:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.status(201).json({ success: true, message: "Feedback submitted successfully!" });
  });
});

// ✅ Use your Gemini API route if needed
app.use("/api", geminiRoute);

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
