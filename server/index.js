const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

// Import your routes
const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const medicineRoutes = require('./routes/medicine');
const userRoutes = require('./routes/user');
const donationRoutes = require('./routes/donations');
const uploadRoute = require('./routes/upload'); // Keep this for general image uploads

const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // For parsing application/json bodies
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded bodies

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api/user', userRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/upload', uploadRoute); // Keep this route for general image uploads (e.g., donation photos)

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  })
  .catch(err => console.error('❌ DB Error:', err));

// Optional: Basic root route for server health check
app.get('/', (req, res) => {
  res.send('Nutricure Backend is alive and kicking!');
});
