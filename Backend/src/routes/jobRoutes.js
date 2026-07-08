import express from "express";
import { createJob, deleteJob, getJob, listJobs, updateJob } from "../controllers/jobController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", listJobs);
router.get("/:id", getJob);
router.post("/", protect, authorize("employer", "admin"), createJob);
router.patch("/:id", protect, authorize("employer", "admin"), updateJob);
router.delete("/:id", protect, authorize("employer", "admin"), deleteJob);

export default router;
