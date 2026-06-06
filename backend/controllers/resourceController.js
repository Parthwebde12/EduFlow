const Resource = require('../models/Resource');
const { cloudinary } = require('../config/cloudinary');

const getResources = async (req, res) => {
  try {
    const { search, category, subject, page = 1, limit = 12 } = req.query;
    const query = { $or: [{ owner: req.user._id }, { isPublic: true }] };
    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    const skip = (page - 1) * limit;
    const resources = await Resource.find(query).populate('owner', 'name profilePhoto').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Resource.countDocuments(query);
    res.json({ success: true, resources, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch resources.' });
  }
};

const createResource = async (req, res) => {
  try {
    const { title, description, category, subject, tags, link, isPublic, resourceType } = req.body;
    const resourceData = {
      title, description: description || '', category, subject,
      tags: tags ? tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [],
      isPublic: isPublic !== 'false', resourceType, owner: req.user._id
    };
    if (resourceType === 'link') {
      resourceData.link = link;
    } else if (req.file) {
      resourceData.file = { url: req.file.path, publicId: req.file.filename, originalName: req.file.originalname, fileType: req.file.mimetype, size: req.file.size || 0 };
    }
    const resource = await Resource.create(resourceData);
    await resource.populate('owner', 'name profilePhoto');
    res.status(201).json({ success: true, message: 'Resource shared successfully!', resource });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create resource.', error: error.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });
    const userId = req.user._id;
    const likeIndex = resource.likes.indexOf(userId);
    if (likeIndex === -1) { resource.likes.push(userId); } else { resource.likes.splice(likeIndex, 1); }
    await resource.save();
    res.json({ success: true, liked: likeIndex === -1, likesCount: resource.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle like.' });
  }
};

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findOne({ _id: req.params.id, owner: req.user._id });
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });
    
    if (resource.resourceType === 'file' && resource.file.publicId) {
      const fileType = resource.file.fileType?.includes('pdf') || resource.file.fileType?.includes('doc') ? 'raw' : 'image';
      await cloudinary.uploader.destroy(resource.file.publicId, { resource_type: fileType });
    }
    
    await resource.deleteOne();
    res.json({ success: true, message: 'Resource deleted successfully!' });
  } catch (error) {
    console.error('DELETE RESOURCE ERROR:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resource.' });
  }
};
module.exports = { getResources, createResource, toggleLike, deleteResource };