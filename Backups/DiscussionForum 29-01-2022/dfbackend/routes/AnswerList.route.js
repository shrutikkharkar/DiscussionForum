const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const answerListController = require('../controllers/AnswerList.controller.js')


//POST ANSWER
router.post('/post', auth, answerListController.postAnswer);


router.post('/deleteAnswer/:id', auth, answerListController.deleteAnswer);

//LIKE DISLIKE SAVE START

router.post('/like/:id', auth, answerListController.likeAnswer);


router.post('/removeLike/:id', auth, answerListController.removeLike);


router.post('/dislike/:id', auth, answerListController.dislikeAnswer);


router.post('/removeDislike/:id', auth, answerListController.removeDislike);


router.post('/save/:id', auth, answerListController.saveAnswer);


router.post('/removeSave/:id', auth, answerListController.removeSavedAnswer);


//LIKE DISLIKE SAVE END


//GET LIKE DISLIKE SAVE
router.get('/getAnswered', auth, answerListController.getAnswered);


router.get('/getSaved', auth, answerListController.getSavedAnswers);


router.get('/getLiked', auth, answerListController.getLikedAnswers);


//GET LIKE DISLIKE SAVE END




router.get('/get', answerListController.getAnswers);


router.get('/get/:id', answerListController.getAnswersForQuestionID);


router.get('/getForUser/:id', auth, answerListController.getAnswersForUser);


router.get('/getAllAnswerDetails', adminAuth, answerListController.getAllAnswerDetails);

router.get('/getAllBlockedAnswerDetails', adminAuth, answerListController.getAllBlockedAnswerDetails);

router.get('/getAllMeBlockedAnswerDetails', adminAuth, answerListController.getAllMeBlockedAnswerDetails);
    
router.post('/removeAnswerByAdmin/:id', adminAuth, answerListController.removeAnswerByAdmin);

router.post('/unblockAnyAnswerByAdmin/:id', adminAuth, answerListController.unblockAnyAnswerByAdmin);

router.post('/unblockMyBlockedAnswerByAdmin/:id', adminAuth, answerListController.unblockMyBlockedAnswerByAdmin);

router.post('/reportAnswerByUser/:id', auth, answerListController.reportAnswerByUser);

router.get('/getAllFlaggedAnswers', adminAuth, answerListController.getAllFlaggedAnswers);



module.exports = router
