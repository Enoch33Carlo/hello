import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/gemini-insight", async (req, res) => {
  const { reportData } = req.body;

  if (!reportData)
    return res.status(400).json({ error: "Missing report data." });

  const prompt = `
  You are an AI event analyst.
  Analyze the following event data and provide concise insights on attendance, engagement, and improvement:
  ${JSON.stringify(reportData, null, 2)}
  `;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-base",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const data = await response.json();
    console.log("🤖 HuggingFace Raw Response:", data);

    // Extract model output safely
    const insights =
      Array.isArray(data) && data[0]?.generated_text
        ? data[0].generated_text
        : "No insights generated.";

    res.json({ insights });
  } catch (error) {
    console.error("HuggingFace API Error:", error);
    res.status(500).json({ error: "Failed to generate insights." });
  }
});

export default router;
