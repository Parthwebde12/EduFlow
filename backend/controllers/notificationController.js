const Notification = require('../models/Notifications');

const fetchNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({owner: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      notifications: notifications
    });

  } catch (error) {
    console.error('fetchNotifications ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({ _id:req.params.id, owner: req.user._id });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });
    notification.isRead = true;
    await notification.save();
    res.json({ success: true, message: 'Notification marked as read.', notification });
  } catch (error) {
    console.error('markAsRead ERROR:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notification as read.' });
  }
};
const markAllAsRead = async (req, res) => {
  try {
    const notifications = await Notification.updateMany({ owner: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read.', notifications });
  } catch (error) {
    console.error('markAllAsRead ERROR:', error);
    res.status(500).json({ success: false, message: 'Failed to mark notifications as read.' });
  }
};
const deleteNotification = async (req, res) => {
  try {
    const notifications = await Notification.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    res.json({
      success: true,
      notifications: notifications
    });

  } catch (error) {
    console.error('deleteNotification ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
module.exports = {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};