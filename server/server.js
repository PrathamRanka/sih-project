import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import resultRoutes from "./routes/resultRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/results", resultRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🌊 Marine Biodiversity Backend is running...");
});

// Error handler middleware
import { errorHandler } from "./middleware/errorHandler.js";
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
