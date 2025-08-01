const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig');
// const Message = require('../models/Message'); // REMOVED: No longer creating Message documents here

// Configure multer storage to keep file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST route for a single image upload to Cloudinary
// This endpoint expects a 'file' field in multipart/form-data.
// It returns the Cloudinary URL and public_id.
router.post('/', upload.single('file'), async (req, res) => {
  try {
    // Check if a file was uploaded.
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Upload the image buffer to Cloudinary.
    // The `data:` URI scheme is used to send the base64 encoded file directly.
    const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
      folder: 'nutricure-donations', // Use a specific folder for donation images
      // You can add transformations here if you want to optimize images on upload:
      // transformation: { width: 800, height: 600, crop: "limit" }
    });

    // Send back the Cloudinary URL and public_id.
    // These will be stored in your Donation model.
    res.status(200).json({
      message: 'Image uploaded to Cloudinary successfully',
      imageUrl: result.secure_url,
      imagePublicId: result.public_id
    });

  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
});

module.exports = router;
