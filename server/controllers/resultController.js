import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let results = []; // in-memory store

// Load static ML model JSON
const mlDataPath = path.join(__dirname, "..", "mlModel.json");
const mlData = JSON.parse(fs.readFileSync(mlDataPath, "utf-8"));

// 📦 Configure multer for in-memory storage for easier handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Process result using static ML JSON + Gemini API
 */
export const processResult = async (req, res, next) => {
  try {
    const file = req.file; // The uploaded file is now available here

    if (!file) {
      return res.status(400).json({ message: "❌ Image file required" });
    }

    // Convert the image buffer to a Base64 string
    const base64Data = file.buffer.toString('base64');

    // --- Step 1: Use static ML detections ---
    const localDetections = mlData.detections || [];

    // --- Step 2: Call Gemini API with the Base64 data ---
    // This is the robust solution that avoids public URL hosting.
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "Identify marine species and counts in this image. Respond strictly in JSON array format like: [{\"species\":\"plankton\",\"count\":12}]"
              },
              {
                "inlineData": {
                  "mimeType": file.mimetype,
                  "data": base64Data
                }
              }
            ]
          }
        ]
      }
    );

    let geminiDetections = [];
    try {
      const raw = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const jsonMatch = raw.match(/```json\s*([\s\S]*?)\s*```/);
      let jsonString = raw;

      if (jsonMatch && jsonMatch[1]) {
        jsonString = jsonMatch[1];
      } else {
        jsonString = jsonString.trim();
      }
      geminiDetections = JSON.parse(jsonString);
    } catch (err) {
      console.warn("⚠️ Could not parse Gemini response, using [] instead");
      console.error("Raw response that failed parsing:", geminiResponse.data);
      geminiDetections = [];
    }

    // --- Step 3: Compare results ---
    const isMatch = JSON.stringify(localDetections.sort()) === JSON.stringify(geminiDetections.sort());
    const finalDetections = isMatch ? localDetections : geminiDetections;

    // --- Step 4: Save result in-memory ---
    const newResult = {
      id: results.length + 1,
      // Note: We don't have a public imageUrl, but for a real app, you'd store one here.
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
    console.error("Full Error:", err.response?.data || err.message);
    next(err);
  }
};

export const getResults = (req, res) => {
  res.json(results);
};