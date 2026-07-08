import express from "express";
import { getMyCertificates } from "../controllers/testController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyCertificates);

export default router;
