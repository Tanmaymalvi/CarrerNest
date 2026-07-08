import express from "express";
import { createCompany, listCompanies, updateCompany } from "../controllers/companyController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", listCompanies);
router.post("/", protect, authorize("employer", "admin"), upload.single("logo"), createCompany);
router.patch("/:id", protect, authorize("employer", "admin"), updateCompany);

export default router;
