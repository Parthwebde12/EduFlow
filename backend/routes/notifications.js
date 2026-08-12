const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const { handleValidation } = require('../middleware/validate');

router.get('/', protect, notificationController.fetchNotifications);
router.patch('/:id/read', protect, notificationController.markAsRead);
router.patch('/read', protect, notificationController.markAllAsRead);
router.delete('/:id', protect, notificationController.deleteNotification);

module.exports = router;