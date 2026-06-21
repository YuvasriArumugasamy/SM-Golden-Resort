const cloudinary = require("cloudinary").v2;
const Gallery = require("../models/Gallery");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET all gallery photos — Public
const getGallery = async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching gallery" });
  }
};

// POST upload photo — Protected (Admin)
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "sm-golden-resorts", resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const photo = await Gallery.create({
      url:      result.secure_url,
      publicId: result.public_id,
      label:    req.body.label || "Resort Photo",
      category: req.body.category || "general",
    });

    res.status(201).json({ message: "Photo uploaded!", photo });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

// DELETE photo — Protected (Admin)
const deletePhoto = async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: "Photo not found" });

    await cloudinary.uploader.destroy(photo.publicId);
    await Gallery.findByIdAndDelete(req.params.id);

    res.json({ message: "Photo deleted!" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = { getGallery, uploadPhoto, deletePhoto };
