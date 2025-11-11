// ✅ server.js (Fixed)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";
import bcrypt from "bcrypt";
import multer from "multer";
import db from "./db.js";
import financeRoutes from "./routes/financeRoutes.js";
import eventsRouter from "./routes/events.js";
import { fileURLToPath } from "url";
import path from "path";
import geminiRoute from "./routes/geminiRoute.js";
import { createServer } from "http";  // <-- add this
import { Server } from "socket.io";   // <-- add this
import RegistrationRoutes from "./routes/RegistrationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
dotenv.config();

const app = express();
const server = createServer(app); // <-- create http server for socket.io
app.use("/api/register", RegistrationRoutes);

const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/api/finance", financeRoutes);
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// ✅ Real-time attendance logic
let students = [
  { id: 1, name: "John Doe", attended: false },
  { id: 2, name: "Jane Smith", attended: false },
  { id: 3, name: "Ravi Kumar", attended: false },
];

setInterval(() => {
  const absent = students.filter((s) => !s.attended);
  if (absent.length > 0) {
    const random = absent[Math.floor(Math.random() * absent.length)];
    random.attended = true;
    io.emit("attendance_update", random);
  }
}, 4000);

app.use("/api/events", eventsRouter);
app.use("/uploads", express.static("uploads")); // serve uploaded images

// ✅ Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Add new event route
app.post("/api/events", upload.single("image"), (req, res) => {
  const { title, category, date, time, location, venue, payment, description } = req.body;
  const image = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO events 
    (title, category, date, time, location, venue, payment, image, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, category, date, time, location, venue, payment, image, description], (err) => {
    if (err) {
      console.error("❌ Error inserting event:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ success: true, message: "✅ Event added successfully!" });
  });
});

// ✅ Example delete route
router.delete("/events/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM events WHERE id = ?", [id]);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// ✅ Login route
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

// ✅ Registration route
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

// ✅ Route to add event into finance table
app.post("/api/finance", (req, res) => {
  const { eventId, eventName } = req.body;

  if (!eventId || !eventName) {
    return res.status(400).json({ error: "Missing eventId or eventName" });
  }

  const sql = `
    INSERT INTO finance (eventId, eventName)
    SELECT ?, ? FROM DUAL
    WHERE NOT EXISTS (SELECT 1 FROM finance WHERE eventId = ?)
  `;

  db.query(sql, [eventId, eventName, eventId], (err, result) => {
    if (err) {
      console.error("❌ MySQL Error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(409).json({ message: "Event already exists in finance table" });
    }

    res.json({ message: "✅ Event added to finance successfully!" });
  });
});

/// GET all finance records
app.get("/api/finance", (req, res) => {
  db.query("SELECT * FROM finance", (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json(results);
  });
});

// PUT update finance record
app.put("/api/finance/:id", (req, res) => {
  const { cashCollected, onlineCollected } = req.body;
  db.query(
    "UPDATE finance SET cashCollected=?, onlineCollected=? WHERE id=?",
    [cashCollected, onlineCollected, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json({ message: "Updated successfully" });
    }
  );
});



// ✅ User details
app.get("/api/user/:email", (req, res) => {
  const { email } = req.params;

  const sql = "SELECT firstName, lastName, email, role FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ error: "Server error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    res.json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
    });
  });
});

// ✅ Gemini API route
app.post("/api/gemini-insight", async (req, res) => {
  try {
    const { reportData } = req.body;
    if (!reportData) {
      return res.status(400).json({ error: "Missing report data" });
    }

    // 🔥 Replace this with your Gemini API call
    const mockInsight = `Based on ${reportData.registrations} registrations and ${reportData.earnings} earnings, 
    the event "${reportData.title}" had a strong turnout!`;

    res.json({ insights: mockInsight });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Failed to generate AI insights" });
  }
});
app.use("/api/reports", reportRoutes);


app.get("/api/events", async (req, res) => {
  const [rows] = await db.execute("SELECT id, title FROM events");
  res.json(rows);
});

// ✅ Route to generate AI-based PDF report
app.post("/api/reports/generate", async (req, res) => {
  try {
    const { eventId } = req.body;

    // 1️⃣ Get event details
    const [[event]] = await db.query("SELECT * FROM events WHERE id = ?", [eventId]);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2️⃣ Get registrations
    const [registrations] = await db.query("SELECT * FROM registrations WHERE eventId = ?", [eventId]);

    // 3️⃣ Get finance data
    const [[finance]] = await db.query("SELECT * FROM finance WHERE eventId = ?", [eventId]);

    // 4️⃣ AI-like insights (local mock)
    const totalRegistrations = registrations.length;
    const totalEarnings =
      (finance?.cashCollected || 0) + (finance?.onlineCollected || 0);

    let aiInsight = "";
    if (totalRegistrations > 50) {
      aiInsight = "This event achieved excellent participation and engagement.";
    } else if (totalRegistrations > 20) {
      aiInsight = "Good participation with potential for further outreach.";
    } else {
      aiInsight = "Low turnout — consider increasing promotion or incentives.";
    }

    // 5️⃣ Generate PDF
    const doc = new PDFDocument();
    const filename = `EventReport_${eventId}.pdf`;
    const filePath = `./public/${filename}`;
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // --- PDF Layout ---
    doc.fontSize(20).text("🎓 Event Performance Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Event Title: ${event.title}`);
    doc.text(`Category: ${event.category || "N/A"}`);
    doc.text(`Date: ${event.date}`);
    doc.text(`Time: ${event.time}`);
    doc.text(`Venue: ${event.venue || event.location || "N/A"}`);
    doc.moveDown();

    doc.fontSize(14).text(`Total Registrations: ${totalRegistrations}`);
    doc.text(`Cash Collected: ₹${finance?.cashCollected || 0}`);
    doc.text(`Online Collected: ₹${finance?.onlineCollected || 0}`);
    doc.text(`Total Earnings: ₹${totalEarnings.toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(13).text("💡 AI Insight:", { underline: true });
    doc.text(aiInsight);
    doc.moveDown(2);

    doc.fontSize(12).text("Generated by AI Campus Event System", { align: "right" });

    doc.end();

    writeStream.on("finish", () => {
      res.download(filePath, filename);
    });
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).json({ message: "Error generating report" });
  }
});
//attendentce
app.use("/api/registrations", registrationRoutes);

//student Event Register
app.use("/api/events", eventRoutes);

// ✅ Start server
const PORT = 5000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
