const mongoose = require('mongoose');


const taskSchema= new mongoose.Schema({
    title: String,
    required: [true,'TASK title required'],
    trim: true,
    maxlenght:[50,'Title should not exceed 50 charecter'],
},
description: {
    type: String,
    maxlenght:[400,'Description must not exeed 400 charecters'],
    default:' '
},
priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },
  dueDate: {
    type: Date,
    default: null
  },
  subject: {
    type: String,
    trim: true,
    default: ''
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);


