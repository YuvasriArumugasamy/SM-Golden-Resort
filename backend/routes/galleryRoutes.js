const express = require("express");
const router  = express.Router();
const multer  = require("multer");
const auth    = require("../middleware/authMiddleware");
const { getGallery, uploadPhoto, deletePhoto } = require("../controllers/galleryController");

// Use memory storage — pass buffer to Cloudinary
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get("/",           getGallery);
router.post("/",   auth,  upload.single("photo"), uploadPhoto);
router.delete("/:id", auth, deletePhoto);

module.exports = router;
