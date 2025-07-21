const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User'); // ✅ Import User model
const jwt = require('jsonwebtoken');

// Example auth middleware
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


router.post('/', auth, async (req, res) => {
  const { name, quantity, city, address, phone, expectedEdibleTill, image } = req.body;
  if (!name || !quantity || !city || !address || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
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
      image 
    });

    await donation.save();
    res.json(donation);
  } catch (err) {
    console.error('Error saving food donation:', err);
    res.status(500).json({ error: 'Error saving donation' });
  }
});


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
