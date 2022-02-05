const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const notificationListController = require('../controllers/NotificationList.controller.js')

router.get('/getNotificationsForUser', auth, notificationListController.getNotificationsForUser);

router.get('/getNotificationsForAdmin', adminAuth, notificationListController.getNotificationsForAdmin);

router.post('/clearAllNotifications', auth, notificationListController.clearAllNotifications);

module.exports = router