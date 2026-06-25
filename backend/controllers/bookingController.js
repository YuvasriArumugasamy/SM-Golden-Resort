const Booking = require("../models/Booking");
const Room = require("../models/Room");

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res) => {
  try {
    const { guestName, phone, email, roomId, checkIn, checkOut, guests } = req.body;

    if (!guestName || !phone || !roomId || !checkIn || !checkOut) {
      return res.status(400).json({ message: "Guest name, phone, room, check-in and check-out are required" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      return res.status(400).json({ message: "Invalid check-in or check-out date" });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: "Check-out must be after check-in" });
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const totalPrice = nights * room.price;

    const booking = new Booking({
      guestName: guestName.trim(),
      phone: phone.trim(),
      email: email ? email.trim().toLowerCase() : "",
      roomId: room.roomId,
      roomName: room.name,
      roomType: room.type,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      totalPrice,
      guests: guests || 1,
      status: "pending",
    });

    const savedBooking = await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking: savedBooking });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Server error creating booking" });
  }
};

// @desc    Get all bookings with optional filters
// @route   GET /api/bookings
// @access  Protected
const getAllBookings = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { guestName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { roomName: { $regex: search, $options: "i" } },
      ];
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Server error fetching bookings" });
  }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Protected
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Status updated successfully", booking });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server error updating booking status" });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Protected
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({ message: "Server error deleting booking" });
  }
};

// @desc    Get booking by short ID (last 6 chars of _id, uppercase) — Public
// @route   GET /api/bookings/id/:shortId
// @access  Public
const getBookingByShortId = async (req, res) => {
  try {
    const { shortId } = req.params;
    if (!shortId || shortId.length < 4) {
      return res.status(400).json({ message: "Invalid Booking ID" });
    }

    const search = shortId.trim();

    // Find booking using same numeric formula as booking confirmation page
    const bookings = await Booking.find({}).select(
      "guestName phone roomType roomName checkIn checkOut guests totalPrice status createdAt"
    ).lean();

    const match = bookings.find(b => {
      try {
        const num = parseInt(b._id.toString().slice(-8), 16);
        const generated = String(Math.abs(num) % 1000000).padStart(6, "0");
        return generated === search;
      } catch { return false; }
    });

    if (!match) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      _id: match._id,
      guestName: match.guestName,
      phone: match.phone,
      roomType: match.roomType || match.roomName,
      checkIn: match.checkIn,
      checkOut: match.checkOut,
      guests: match.guests,
      totalPrice: match.totalPrice,
      status: match.status,
      createdAt: match.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createBooking, getAllBookings, updateBookingStatus, deleteBooking, getBookingByShortId };
