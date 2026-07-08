import express from "express";
import {
  getAllTests,
  getTestById,
  startTest,
  submitTest,
  createTest,
  updateTest,
  deleteTest,
  getQuestionsForAdmin,
  createAssessmentQuestion,
  updateAssessmentQuestion,
  deleteAssessmentQuestion,
  getAllResults,
} from "../controllers/testController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllTests);
router.get("/:id", getTestById);
router.post("/start", protect, startTest);
router.post("/submit", protect, submitTest);

// Admin-only endpoints
router.post("/", protect, authorize("admin"), createTest);
router.put("/:id", protect, authorize("admin"), updateTest);
router.delete("/:id", protect, authorize("admin"), deleteTest);

router.get("/questions/all", protect, authorize("admin"), getQuestionsForAdmin);
router.post("/questions", protect, authorize("admin"), createAssessmentQuestion);
router.put("/questions/:id", protect, authorize("admin"), updateAssessmentQuestion);
router.delete("/questions/:id", protect, authorize("admin"), deleteAssessmentQuestion);

router.get("/results/all", protect, authorize("admin"), getAllResults);

export default router;
