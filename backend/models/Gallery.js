const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  url:       { type: String, required: true },
  publicId:  { type: String, required: true },
  label:     { type: String, default: "Resort Photo" },
  category:  { type: String, default: "general" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Gallery", gallerySchema);
