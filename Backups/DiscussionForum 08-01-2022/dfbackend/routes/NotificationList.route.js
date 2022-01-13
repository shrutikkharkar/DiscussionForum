const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const notificationListController = require('../controllers/NotificationList.controller.js')


module.exports = router