import express from "express";
import { createResume, deleteResume, getResumeById, getResumes, setPrimaryResume, updateResume, uploadResume } from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, createResume);
router.post("/upload", protect, upload.single("resume"), uploadResume);
router.put("/set-primary", protect, setPrimaryResume);
router.get("/detail/:resumeId", protect, getResumeById);
router.patch("/:resumeId", protect, updateResume);
router.get("/:userId", getResumes);
router.delete("/:resumeId", protect, deleteResume);

export default router;
