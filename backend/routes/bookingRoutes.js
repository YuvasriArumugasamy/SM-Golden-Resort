const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/bookings — Public
router.post("/", createBooking);

// GET /api/bookings — Protected
router.get("/", authMiddleware, getAllBookings);

// PATCH /api/bookings/:id/status — Protected
router.patch("/:id/status", authMiddleware, updateBookingStatus);

// DELETE /api/bookings/:id — Protected
router.delete("/:id", authMiddleware, deleteBooking);

module.exports = router;
