const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  beds: { type: String, required: true },
  badge: { type: String, required: true },
  available: { type: Boolean, default: true },
  amenities: [{ type: String }],
});

module.exports = mongoose.model("Room", roomSchema);
