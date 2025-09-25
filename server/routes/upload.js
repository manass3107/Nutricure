const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/', upload.single('file'), async (req, res) => {
  try {
    // Check if a file was uploaded.
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Upload the image buffer to Cloudinary.
    // The `data:` URI scheme is used to send the base64 encoded file directly.
    const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
      folder: 'nutricure-donations',
    });

    // Send back the Cloudinary URL and public_id.
    // These will be stored in Donation model.
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
