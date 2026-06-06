const Note = require('../models/Note');
const { cloudinary } = require('../config/cloudinary');

const getNotes = async (req, res) => {
  try {
    const { search, subject, page = 1, limit = 10 } = req.query;
    const query = { owner: req.user._id };
    if (search) query.$text = { $search: search };
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    const skip = (page - 1) * limit;
    const notes = await Note.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Note.countDocuments(query);
    res.json({ success: true, notes, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notes.' });
  }
};

const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    res.json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch note.' });
  }
};

const uploadNote = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
    const { title, description, subject, tags, isPublic } = req.body;
    const fileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
    const note = await Note.create({
      title, description: description || '', subject,
      tags: tags ? tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [],
      file: { url: req.file.path, publicId: req.file.filename, originalName: req.file.originalname, fileType, size: req.file.size || 0 },
      isPublic: isPublic === 'true',
      owner: req.user._id
    });
    res.status(201).json({ success: true, message: 'Note uploaded successfully!', note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload note.', error: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    const { title, description, subject, tags, isPublic } = req.body;
    if (title) note.title = title;
    if (description !== undefined) note.description = description;
    if (subject) note.subject = subject;
    if (tags !== undefined) note.tags = tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
    if (isPublic !== undefined) note.isPublic = isPublic === 'true' || isPublic === true;
    await note.save();
    res.json({ success: true, message: 'Note updated successfully!', note });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update note.' });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    if (note.file.publicId) {
  const fileType = note.file.fileType?.includes('pdf') ? 'raw' : 'image';
  await cloudinary.uploader.destroy(note.file.publicId, { resource_type: fileType });
}
    await note.deleteOne();
    res.json({ success: true, message: 'Note deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete note.' });
  }
};

const trackDownload = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found.' });
    note.downloads += 1;
    await note.save();
    res.json({ success: true, downloadUrl: note.file.url });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to track download.' });
  }
};

module.exports = { getNotes, getNote, uploadNote, updateNote, deleteNote, trackDownload };