import express from "express";
import { createOrder, verifyPayment, getPurchaseHistory } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All order routes are protected
router.post("/create", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/history", protect, getPurchaseHistory);

export default router;
