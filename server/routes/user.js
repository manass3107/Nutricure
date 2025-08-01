// server/routes/user.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.patch('/city', async (req, res) => {
  const authHeader = req.headers.authorization;
  console.log('🔍 Authorization header:', authHeader);

  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(403).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded:', decoded);

    const { city } = req.body;
    if (!city) return res.status(400).json({ error: 'City is required' });

    await User.findByIdAndUpdate(decoded.userId, { city });
    res.json({ message: 'City updated successfully' });
  } catch (err) {
    console.error('City update error:', err);
    res.status(500).json({ error: 'Failed to update city' });
  }
});


module.exports = router;
