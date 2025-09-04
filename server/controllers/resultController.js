import axios from "axios";

let results = []; // In-memory store (use DB later if needed)

/**
 * Process result by fetching from ML API + Gemini API
 */
export const processResult = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "❌ Image URL required" });
    }

    // --- Step 1: Call local ML model API ---
    const mlResponse = await axios.post(process.env.ML_MODEL_API, { imageUrl });
    const localDetections = mlResponse.data?.detections || [];

    // --- Step 2: Call Gemini API ---
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              { text: `Identify marine species and counts in this image: ${imageUrl}. Respond strictly in JSON array format like: [{"species":"plankton","count":12}]` }
            ]
          }
        ]
      }
    );

    // Gemini may return text → parse into JSON safely
    let geminiDetections = [];
    try {
      const raw = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      geminiDetections = JSON.parse(raw);
    } catch (err) {
      console.warn("⚠️ Could not parse Gemini response, using [] instead");
      geminiDetections = [];
    }

    // --- Step 3: Compare both results ---
    const isMatch =
      JSON.stringify(localDetections.sort()) === JSON.stringify(geminiDetections.sort());

    const finalDetections = isMatch ? localDetections : geminiDetections;

    // --- Step 4: Save in-memory (later replace with DB) ---
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
 * Get all processed results
 */
export const getResults = (req, res) => {
  res.json(results);
};
