import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAssignments,
  acceptAssignment,
  rejectAssignment,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/assignments", protectAdmin, getAssignments);
router.post("/assignments/:id/accept", protectAdmin, acceptAssignment);
router.post("/assignments/:id/reject", protectAdmin, rejectAssignment);

export default router;
