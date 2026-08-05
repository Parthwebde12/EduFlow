const mongoose = require('mongoose');

const notificationsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    maxlength: [300, 'Message cannot exceed 300 characters'],
    default: ''
  },
  type: {
    type: String,
    enum: ['task', 'resources', 'auth', 'system'],
    default: 'system'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
 }, {
   timestamps: true
 });

module.exports = mongoose.model('Notification', notificationsSchema);
