import express from "express";
import { createExperience, getExperiences } from "../controllers/prepController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getExperiences);
router.post("/", protect, createExperience);

export default router;
