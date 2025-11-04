// ReportServer/routes/reportRoutes.js
import express from "express";
import { generateReport } from "../controllers/reportController.js";

const router = express.Router();

// 🧾 POST: Generate report for a specific event
router.post("/generate", generateReport);

export default router;
