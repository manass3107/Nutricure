// server/routes/food.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User'); // Import User model
const jwt = require('jsonwebtoken');

// Example auth middleware (already present)
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// POST route for creating a food donation
// This route now expects the 'image' field in req.body to be the Cloudinary URL
router.post('/', auth, async (req, res) => {
  const { name, quantity, city, address, phone, expectedEdibleTill, image } = req.body;

  // Basic validation: all required fields (except image, which is optional)
  if (!name || !quantity || !city || !address || !phone || !expectedEdibleTill) { // Added expectedEdibleTill as required
    return res.status(400).json({ error: 'All required fields (Name, Quantity, City, Address, Phone, Edible Till) are missing.' });
  }

  try {
    const donation = new Donation({
      donorId: req.user.userId,
      type: 'food',
      name,
      quantity,
      city,
      address,
      phone,
      expectedEdibleTill,
      image // The 'image' field will now directly store the Cloudinary URL passed from frontend
    });

    await donation.save();
    res.status(201).json(donation); // Respond with the created donation object
  } catch (err) {
    console.error('Error saving food donation:', err);
    res.status(500).json({ error: 'Error saving donation' });
  }
});

// GET route for fetching food donations (already present and fine)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { search } = req.query;

    const query = {
      type: 'food',
      status: 'pending',
      city: user.city,
      expectedEdibleTill: { $gte: new Date() }
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const food = await Donation.find(query);
    res.json(food);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH route for accepting food donation (already present and fine)
router.patch('/:id/accept', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.status !== 'pending') {
      return res.status(400).json({ error: 'Donation is no longer pending' });
    }

    donation.status = 'accepted';
    donation.acceptedBy = req.user.userId;
    donation.acceptedAt = new Date();
    await donation.save();

    res.json({ message: 'Donation accepted successfully' });
  } catch (err) {
    console.error('Error accepting donation:', err);
    res.status(500).json({ error: 'Failed to accept donation' });
  }
});

module.exports = router;