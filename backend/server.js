const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');
const adminRoutes = require('./routes/adminRoutes');
const walletRoutes = require('./routes/walletRoutes');

// Initialize background jobs (like the 10 PM Auto-Pilot)
require('./cron/scheduler');

dotenv.config();

const app = express();


app.use(cors({ origin: ['http://localhost:5173', 'https://mess-mate-alpha.vercel.app'], credentials: true })); 
app.use(express.json()); 
app.use(cookieParser()); 
app.use('/api/auth', authRoutes);   
app.use('/api/meals', mealRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/messes', require('./routes/messRoutes'));
app.use('/api/canteen', require('./routes/canteenRoutes'));
app.use('/api/polls', require('./routes/pollRoutes'));

app.get('/', (req, res) => {
  res.send('MessMate API is running!');
});


mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

module.exports = app;
