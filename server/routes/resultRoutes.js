import express from "express";
import { processResult, getResults } from "../controllers/resultController.js";

const router = express.Router();

// POST → fetch ML + Gemini → compare → store
router.post("/", processResult);

// GET → return all stored results
router.get("/", getResults);

export default router;
