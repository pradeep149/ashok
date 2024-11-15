import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register); // Register endpoint for users and admins
router.post("/login", login); // Login endpoint for users and admins

export default router;
