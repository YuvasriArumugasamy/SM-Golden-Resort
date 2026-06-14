const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  guestName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: "" },
  roomId: { type: String, required: true },
  roomName: { type: String, required: true },
  roomType: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  nights: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  guests: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
