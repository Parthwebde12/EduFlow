const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/Eduflow')
  .then(() => {
    console.log('Connected to MongoDB');
    console.log(' DB:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });