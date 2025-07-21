const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: 'No token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};

router.post('/', auth, async (req, res) => {
  const { name, quantity, city, address, phone, expiryDate, image } = req.body; 

  if (!name || !quantity || !city || !address || !phone || !expiryDate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newDonation = new Donation({
      donorId: req.user.userId,
      type: 'medicine',
      name,
      quantity,
      city,
      address,
      phone,
      expiryDate,
      image 
    });

    await newDonation.save();
    res.status(201).json({ message: 'Medicine donation created successfully' });
  } catch (err) {
    console.error('Medicine donation error:', err.message);
    res.status(500).json({ error: 'Failed to donate medicine' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { search } = req.query;
    const query = {
      type: 'medicine',
      status: 'pending',
      city: user.city,
      expiryDate: { $gte: new Date() }
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' }; 
    }

    const meds = await Donation.find(query);
    res.json(meds);
  } catch (err) {
    console.error('❌ Error fetching donations:', err);
    res.status(500).json({ error: 'Error fetching donations' });
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
