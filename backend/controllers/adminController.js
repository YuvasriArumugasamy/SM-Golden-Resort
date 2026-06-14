const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Booking = require("../models/Booking");

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// @desc    Get Dashboard Stats
// @route   GET /api/admin/stats
// @access  Protected
const getStats = async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: "pending" });
    const confirmed = await Booking.countDocuments({ status: "confirmed" });
    const cancelled = await Booking.countDocuments({ status: "cancelled" });

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.status(200).json({
      total,
      pending,
      confirmed,
      cancelled,
      recentBookings,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Server error fetching stats" });
  }
};

module.exports = { login, getStats };
