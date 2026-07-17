const mongoose = require('mongoose');

const CATEGORIES = [
  'Textbooks', 'Lecture Slides', 'Research Papers','Practice Problems', 'Cheat Sheets', 'Videos','Websites', 'Tools', 'Other'
];

    const resourceSchema= new mongoose.Schema({
        title:{
            type: String,
            required: [true,'Resource title is must'],
trim : true,
maxlength:[100,'Title should not exceed 100 characters']
        },
        description: {
            type: String,
 maxlength: [500, 'Description cannot exceed 500 characters'],
  default: ''
          },
          category: {
            type: String,
            required: [true, 'Category is required'],
            enum: CATEGORIES
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
          
          link: {
            type: String,
            default: ''
          },
          file: {
            url: { type: String, default: '' },
            publicId: { type: String, default: '' },
            originalName: { type: String, default: '' },
            fileType: { type: String, default: '' },
            size: { type: Number, default: 0 }
          },
          resourceType: {
            type: String,
            enum: ['link', 'file'],
            required: true
          },
          isPublic: {
            type: Boolean,
            default: true
          },
          likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }],
         owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // <-- Add this line!
}
        }, {
          timestamps: true
        });


        resourceSchema.index({ title: 'text', description: 'text', subject: 'text', tags: 'text' });

        // Index on owner field to optimise all owner-based queries
        // (e.g. fetching, filtering, and deleting a user's resources)
        resourceSchema.index({ owner: 1 });


        module.exports = mongoose.model('Resource', resourceSchema)
