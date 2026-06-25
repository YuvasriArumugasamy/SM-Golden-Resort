const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getBookingByShortId,
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/bookings — Public
router.post("/", createBooking);

// GET /api/bookings/id/:shortId — Public (customer booking lookup)
router.get("/id/:shortId", getBookingByShortId);

// GET /api/bookings/search?bookingId=XXXXXX — Public (alternative)
router.get("/search", async (req, res) => {
  const { bookingId } = req.query;
  if (!bookingId) return res.status(400).json({ message: "bookingId required" });
  req.params = { shortId: bookingId };
  return getBookingByShortId(req, res);
});

// GET /api/bookings — Protected
router.get("/", authMiddleware, getAllBookings);

// PATCH /api/bookings/:id/status — Protected
router.patch("/:id/status", authMiddleware, updateBookingStatus);

// DELETE /api/bookings/:id — Protected
router.delete("/:id", authMiddleware, deleteBooking);

module.exports = router;
