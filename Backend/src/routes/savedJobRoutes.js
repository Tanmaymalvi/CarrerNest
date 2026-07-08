import express from "express";
import {
  saveJob,
  getSavedJobs,
  unsaveJob,
  checkIfSaved,
} from "../controllers/savedJobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, saveJob);
router.get("/check/status", protect, checkIfSaved);
router.get("/:userId", protect, getSavedJobs);
router.delete("/:userId/:jobId", protect, unsaveJob);

export default router;
