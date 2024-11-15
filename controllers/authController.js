import User from "../models/User.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * Register a new user or admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!role || (role !== "user" && role !== "admin")) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const Model = role === "user" ? User : Admin;

    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: `${role} already exists` });
    }

    const newUser = new Model({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: `${role} registered successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Login for user or admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!role || (role !== "user" && role !== "admin")) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const Model = role === "user" ? User : Admin;

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: `${role} not found` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
