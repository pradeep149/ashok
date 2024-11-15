import Admin from "../models/Admin.js";
import Assignment from "../models/Assignment.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Admin Registration
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists)
      return res.status(400).json({ message: "Admin already exists" });

    const admin = new Admin({ name, email, password });
    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View Assignments
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ admin: req.admin.id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept Assignment
export const acceptAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    assignment.status = "accepted";
    await assignment.save();

    res.status(200).json({ message: "Assignment accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject Assignment
export const rejectAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    assignment.status = "rejected";
    await assignment.save();

    res.status(200).json({ message: "Assignment rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
