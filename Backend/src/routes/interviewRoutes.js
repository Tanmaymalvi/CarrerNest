import express from "express";
import {
  scheduleInterview,
  getInterviews,
  updateInterviewStatus,
  cancelInterview,
} from "../controllers/interviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, scheduleInterview);
router.get("/:userId", protect, getInterviews);
router.put("/:interviewId", protect, updateInterviewStatus);
router.delete("/:interviewId", protect, cancelInterview);

export default router;
