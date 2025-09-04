import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let results = []; // in-memory store

// Load static ML model JSON
// const mlDataPath = path.join(process.cwd(), "mlModel.json");
const mlDataPath = path.join(__dirname, "mlModel.json");
const mlData = JSON.parse(fs.readFileSync(mlDataPath, "utf-8"));

/**
 * Process result using static ML JSON + Gemini API
 */
export const processResult = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "❌ Image URL required" });
    }

    // --- Step 1: Use static ML detections ---
    const localDetections = mlData.detections || [];

    // --- Step 2: Call Gemini API ---
    const geminiResponse = await axios.post(
       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Identify marine species and counts in this image: ${imageUrl}. Respond strictly in JSON array format like: [{"species":"plankton","count":12}]`
              }
            ]
          }
        ]
      }
    );

   let geminiDetections = [];
try {
  const raw = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  // Use a regex to find and extract the content of the JSON code block
  const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/);
  let jsonString = raw;

  // If a JSON code block is found, use its content
  if (jsonMatch && jsonMatch[1]) {
    jsonString = jsonMatch[1];
  } else {
    // If no markdown block is found, trim whitespace and extra text
    // as a fallback. This handles cases where the model directly outputs JSON.
    jsonString = jsonString.trim();
  }

  geminiDetections = JSON.parse(jsonString);
} catch (err) {
  console.warn("⚠️ Could not parse Gemini response, using [] instead");
  // It's helpful to log the raw response data here to see what caused the error.
  console.error("Raw response that failed parsing:", geminiResponse.data);
  geminiDetections = [];
}
    // --- Step 2: TEMP disable Gemini call (use dummy detections) ---
// const geminiDetections = [
//   { species: "fish", count: 3 },
//   { species: "plankton", count: 12 }
// ];


    // --- Step 3: Compare results ---
    const isMatch =
      JSON.stringify(localDetections.sort()) === JSON.stringify(geminiDetections.sort());

    const finalDetections = isMatch ? localDetections : geminiDetections;

    // --- Step 4: Save result in-memory ---
    const newResult = {
      id: results.length + 1,
      imageUrl,
      localDetections,
      geminiDetections,
      finalDetections,
      source: isMatch ? "local-model" : "gemini",
      timestamp: new Date(),
    };

    results.push(newResult);

    res.status(201).json({
      message: "✅ Result processed successfully",
      data: newResult,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all results
 */
export const getResults = (req, res) => {
  res.json(results);
};
