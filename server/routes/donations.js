const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token (reused from other routes)
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

router.get('/my-donations', auth, async (req, res) => {
  try {
    const myDonations = await Donation.find({ donorId: req.user.userId });
    res.json(myDonations);
  } catch (err) {
    console.error('Error fetching user donations:', err);
    res.status(500).json({ error: 'Failed to fetch your donations' });
  }
});

router.get('/accepted-donations', auth, async (req, res) => {
  try {
    const acceptedDonations = await Donation.find({
      acceptedBy: req.user.userId,
      status: 'accepted'
    });
    res.json(acceptedDonations);
  } catch (err) {
    console.error('Error fetching accepted donations:', err);
    res.status(500).json({ error: 'Failed to fetch accepted donations' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Authorization check: Only the donor can delete the donation
    if (donation.donorId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this donation' });
    }

    if (donation.status !== 'pending') {
      return res.status(400).json({ error: 'Donation cannot be canceled if not pending' });
    }

    await Donation.findByIdAndDelete(req.params.id);

    res.json({ message: 'Donation canceled successfully' });
  } catch (err) {
    console.error('Error canceling donation:', err);
    res.status(500).json({ error: 'Failed to cancel donation' });
  }
});

router.patch('/:id/complete', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (
      donation.donorId.toString() !== req.user.userId &&
      donation.acceptedBy.toString() !== req.user.userId
    ) {
      return res.status(403).json({ error: 'Not authorized to complete this donation' });
    }

    if (donation.status === 'completed') {
      return res.status(400).json({ error: 'Donation is already completed' });
    }

    donation.status = 'completed';
    await donation.save();

    res.json({ message: 'Donation marked as completed successfully' });
  } catch (err) {
    console.error('Error completing donation:', err);
    res.status(500).json({ error: 'Failed to complete donation' });
  }
});

module.exports = router;