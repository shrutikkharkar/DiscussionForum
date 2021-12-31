const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const commentListController = require('../controllers/CommentList.controller.js')


router.post('/addComment/:id', auth, commentListController.addComment);

router.get('/getComments/:id', commentListController.getComments);

router.post('/deleteComment/:id', auth, commentListController.deleteComment);

router.get('/getAllCommentDetails', adminAuth, commentListController.getAllCommentDetails);


module.exports = router