const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Eduflow')
  .then(() => console.log(' MongoDB connected'))
  .catch((err) => console.error('Error:', err.message));