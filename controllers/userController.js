import User from "../models/User.js";
import Assignment from "../models/Assignment.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// User Registration
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload Assignment
export const uploadAssignment = async (req, res) => {
  const { task, admin } = req.body;

  try {
    const adminn = await Admin.findOne({ name: admin });
    if (!adminn) return res.status(404).json({ message: "Admin not found" });

    const assignment = new Assignment({
      userId: req.user.id,
      task,
      admin: adminn._id,
    });
    await assignment.save();

    res
      .status(201)
      .json({ message: "Assignment uploaded successfully", assignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch All Admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, "name email");
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
