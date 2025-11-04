// ReportServer/reportServer.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/reports", reportRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("📊 Report Server is running. Use /api/reports/generate to create reports.");
});

// ✅ Server start
const PORT = process.env.PORT || 6001;
app.listen(PORT, () => {
  console.log(`🚀 Report Server running at http://localhost:${PORT}`);
});
