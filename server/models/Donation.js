// server/models/Donation.js
const mongoose = require('mongoose');
const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['food', 'medicine'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  expectedEdibleTill: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  image: { // This field is already present and will store the Cloudinary URL
    type: String
  },
  acceptedAt: {
    type: Date,
    default: null,
  }
});
module.exports = mongoose.model('Donation', donationSchema);