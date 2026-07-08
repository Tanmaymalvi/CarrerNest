import express from "express";
import {
  analytics,
  listUsers,
  toggleUserStatus,
  deleteUser,
  deleteCompany,
} from "../controllers/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import { updateCompany } from "../controllers/companyController.js";
import { updateJob, deleteJob } from "../controllers/jobController.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/analytics", analytics);

router.get("/users", listUsers);
router.patch("/users/:id/status", toggleUserStatus);
router.delete("/users/:id", deleteUser);

router.patch("/companies/:id", updateCompany);
router.delete("/companies/:id", deleteCompany);

router.patch("/jobs/:id", updateJob);
router.delete("/jobs/:id", deleteJob);

export default router;
