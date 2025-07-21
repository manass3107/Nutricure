const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const foodRoutes = require('./routes/food');
const medicineRoutes = require('./routes/medicine');
const userRoutes = require('./routes/user');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api/user', userRoutes);
app.use('/api/donations', require('./routes/donations'));
app.use('/api/upload', require('./routes/upload')); 
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(5000, () => console.log('🚀 Server running on port 5000'));
})
.catch(err => console.error('❌ DB Error:', err));
