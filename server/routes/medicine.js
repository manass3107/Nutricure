// server/routes/medicine.js
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

// POST route for creating a medicine donation
// This route now expects the 'image' field in req.body to be the Cloudinary URL
router.post('/', auth, async (req, res) => {
  const { name, quantity, city, address, phone, expiryDate, image } = req.body;

  // Basic validation: all required fields 
  if (!name || !quantity || !city || !address || !phone || !expiryDate) {
    return res.status(400).json({ error: 'All required fields (Name, Quantity, City, Address, Phone, Expiry Date) are missing.' });
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
      image // The 'image' field will now directly store the Cloudinary URL passed from frontend
    });

    await newDonation.save();
    res.status(201).json({ message: 'Medicine donation created successfully', donation: newDonation }); // Respond with the created donation object
  } catch (err) {
    console.error('Medicine donation error:', err.message);
    res.status(500).json({ error: 'Failed to donate medicine' });
  }
});

// GET route for fetching medicine donations 
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

// PATCH route for accepting medicine donation (already present and fine)
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