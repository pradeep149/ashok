import express from "express";
import {
  registerUser,
  loginUser,
  uploadAssignment,
  getAllAdmins,
} from "../controllers/userController.js";
import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// User Endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/upload", protectUser, uploadAssignment);
router.get("/admins", protectUser, getAllAdmins);

export default router;
