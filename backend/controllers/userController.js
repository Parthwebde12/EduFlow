const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user: user.toSafeObject() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, college, skills, theme } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (college !== undefined) updateData.college = college;
    if (skills !== undefined) {
      updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (theme) updateData.theme = theme;
    const user = await User.findByIdAndUpdate(req.user._id, updateData, { returnDocument: 'after', runValidators: true });
    res.json({ success: true, message: 'Profile updated successfully!', user: user.toSafeObject() });
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
    const user = await User.findById(req.user._id);
    if (user.profilePhoto.publicId) await cloudinary.uploader.destroy(user.profilePhoto.publicId);
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: { url: req.file.path, publicId: req.file.filename } },
      { new: true }
    );
    res.json({ success: true, message: 'Profile photo updated!', user: updatedUser.toSafeObject() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to upload photo.' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
};

module.exports = { getProfile, updateProfile, uploadProfilePhoto, changePassword };