const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const commentListController = require('../controllers/CommentList.controller.js')


router.post('/addComment/:id', auth, commentListController.addComment);

router.get('/getComments/:id', commentListController.getComments);

router.get('/getCommentsForUser/:id', auth, commentListController.getCommentsForUser);

router.post('/deleteComment/:id', auth, commentListController.deleteComment);

router.get('/getAllCommentDetails', adminAuth, commentListController.getAllCommentDetails);

router.post('/removeCommentByAdmin/:id', adminAuth, commentListController.removeCommentByAdmin);

router.post('/reportCommentByUser/:id', auth, commentListController.reportCommentByUser);

router.post('/unblockAnyCommentByAdmin/:id', adminAuth, commentListController.unblockAnyCommentByAdmin);

router.post('/unblockMyBlockedCommentByAdmin/:id', adminAuth, commentListController.unblockMyBlockedCommentByAdmin);

router.get('/getAllBlockedCommentDetails', adminAuth, commentListController.getAllBlockedCommentDetails);

router.get('/getAllMeBlockedCommentDetails', adminAuth, commentListController.getAllMeBlockedCommentDetails);

router.get('/getAllFlaggedComments', adminAuth, commentListController.getAllFlaggedComments);


module.exports = router