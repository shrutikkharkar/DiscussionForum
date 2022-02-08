const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const tagController = require('../controllers/TagList.controller.js')

router.get('/getAllTagNames', tagController.getAllTagNames)

router.get('/getTagDetails/:tagName', tagController.getTagDetails);

router.get('/getTagDetailsForUser/:tagName', auth, tagController.getTagDetailsForUser);


module.exports = router