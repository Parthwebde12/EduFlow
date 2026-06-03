const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Note title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  file: {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    originalName: { type: String, required: true },
    fileType: { type: String, required: true }, 
    size: { type: Number, required: true } 
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  downloads: {
    type: Number,
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});


noteSchema.index({ title: 'text', subject: 'text', tags: 'text' });

module.exports = mongoose.model('Note', noteSchema);
//
//
//
//

///