// services/geminiClient.js
import genai from "@google/generative-ai"; // replace with actual package name if different
import dotenv from "dotenv";
dotenv.config();

const client = new genai.GenerativeModel({
  apiKey: process.env.GEMINI_API_KEY // or use ADC auth if on Google Cloud
});

// helper to ask for structured analysis
export async function analyzeEventWithGemini(prompt, options = {}) {
  // options may include model name, temperature, etc.
  const model = options.model || "gemini-2.5-flash"; // example
  const response = await client.generate({
    model,
    // the exact SDK call will vary, check your SDK docs
    input: prompt,
    maxOutputTokens: options.maxOutputTokens || 800
  });
  // Extract text (SDK shapes vary)
  return response?.outputText || response?.text || response;
}
