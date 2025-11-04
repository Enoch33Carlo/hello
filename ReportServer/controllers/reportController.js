// controllers/reportController.js
import { pool } from "../services/db.js";
import { analyzeEventWithGemini } from "../services/geminiClient.js";
import { barFinanceChart, piePaymentChart, lineRegistrationsChart } from "../services/mlAnalysis.js";
import { generateEventPDFStream } from "../services/pdfGenerator.js";

export const generateReport = async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId) return res.status(400).json({ message: "Missing eventId" });

    // 1) Fetch event
    const [events] = await pool.query("SELECT * FROM events WHERE id = ?", [eventId]);
    if (events.length === 0) return res.status(404).json({ message: "Event not found" });
    const event = events[0];

    // 2) Fetch finance
    const [financeRows] = await pool.query("SELECT cashCollected, onlineCollected FROM finance WHERE eventId = ?", [eventId]);
    const finance = financeRows[0] || { cashCollected: 0, onlineCollected: 0 };

    // 3) Fetch registrations and optionally compute time-series
    const [registrations] = await pool.query(
      "SELECT studentName, studentEmail, studentDept, regDate FROM registrations WHERE eventId = ? ORDER BY regDate",
      [eventId]
    );

    // build timeseries (group registrations by date)
    const dateCounts = {};
    registrations.forEach(r => {
      const d = new Date(r.regDate).toISOString().slice(0,10);
      dateCounts[d] = (dateCounts[d] || 0) + 1;
    });
    const dates = Object.keys(dateCounts).sort();
    const counts = dates.map(d => dateCounts[d]);

    // 4) Prepare data to send to Gemini
    const prompt = buildGeminiPrompt({ event, finance, registrations, dateSummary: { dates, counts } });

    // 5) Call Gemini for deep analysis (structured)
    const analysisText = await analyzeEventWithGemini(prompt, { model: "gemini-2.5-flash" });

    // 6) Make charts
    const bar = await barFinanceChart(finance);
    const pie = await piePaymentChart(finance);
    const line = await lineRegistrationsChart({ dates, counts });

    // 7) Generate and stream PDF
    await generateEventPDFStream({
      event, finance, registrations,
      analysisText,
      charts: { bar, pie, line }
    }, res);
  } catch (err) {
    console.error("Report error:", err);
    if (!res.headersSent) res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
