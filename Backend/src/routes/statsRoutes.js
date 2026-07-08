import express from "express";
import { getStats } from "../controllers/statsController.js";

const router = express.Router();

// Public endpoint — no auth needed for homepage stats
router.get("/", getStats);

export default router;
