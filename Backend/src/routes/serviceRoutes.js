import express from "express";
import { getAllServices, getServiceById, createService, purchaseService } from "../controllers/serviceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllServices);
router.post("/", protect, authorize("admin"), createService);
router.post("/purchase", protect, purchaseService);
router.get("/:serviceId", getServiceById);

export default router;
