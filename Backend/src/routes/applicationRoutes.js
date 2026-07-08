import express from "express";
import { applyToJob, employerApplications, myApplications, updateApplicationStatus } from "../controllers/applicationController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/me", protect, authorize("student"), myApplications);
router.get("/employer", protect, authorize("employer", "admin"), employerApplications);
router.post("/:jobId", protect, authorize("student"), upload.single("resume"), applyToJob);
router.patch("/:id/status", protect, authorize("student", "employer", "admin"), updateApplicationStatus);

export default router;
