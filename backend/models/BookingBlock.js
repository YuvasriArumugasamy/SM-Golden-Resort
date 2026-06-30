const mongoose = require('mongoose');

const bookingBlockSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

module.exports = mongoose.model('BookingBlock', bookingBlockSchema);
