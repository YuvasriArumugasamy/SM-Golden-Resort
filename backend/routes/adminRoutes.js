const express = require("express");
const router = express.Router();
const { login, getStats } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/admin/login — Public
router.post("/login", login);

// GET /api/admin/stats — Protected
router.get("/stats", authMiddleware, getStats);

module.exports = router;
