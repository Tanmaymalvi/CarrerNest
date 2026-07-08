import express from "express";
import {
  getAllQuestions,
  getByCategory,
  searchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/interviewQuestionsController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllQuestions);
router.get("/search", searchQuestions);
router.get("/category/:category", getByCategory);

// Admin-only routes
router.post("/", protect, authorize("admin"), createQuestion);
router.put("/:id", protect, authorize("admin"), updateQuestion);
router.delete("/:id", protect, authorize("admin"), deleteQuestion);

export default router;
