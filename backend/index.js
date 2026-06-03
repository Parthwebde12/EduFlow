const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/studysync')
  .then(() => console.log(' MongoDB connected'))
  .catch((err) => console.error('Error:', err.message));