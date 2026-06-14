const express = require("express");
const router = express.Router();
const { getAllRooms, toggleAvailability } = require("../controllers/roomController");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/rooms — Public
router.get("/", getAllRooms);

// PATCH /api/rooms/:roomId/toggle — Protected
router.patch("/:roomId/toggle", authMiddleware, toggleAvailability);

module.exports = router;
