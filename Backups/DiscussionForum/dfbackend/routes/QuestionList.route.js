const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const mongoose = require('mongoose')
const Question = require('../models/QuestionList.model')
const questionListController = require('../controllers/QuestionList.controller.js')

router.post('/post', auth, questionListController.askQuestion);

router.post('/addView/:id', auth, questionListController.addView);

router.get('/get', questionListController.getQuestions);

router.get('/getQuestionsAndTagsForSearchBar', questionListController.getQuestionsAndTagsForSearchBar)

router.post('/deleteQuestion/:id' , auth, questionListController.deleteQuestion);

router.get('/questioned', auth, questionListController.getUserAskedQuestions);

router.get('/getAllQuestionDetails', adminAuth, questionListController.getAllQuestionDetails);

router.post('/removeQuestionByAdmin/:id', adminAuth, questionListController.removeQuestionByAdmin);

router.post('/unblockAnyQuestionByAdmin/:id', adminAuth, questionListController.unblockAnyQuestionByAdmin);

router.get('/getAllFlaggedQuestions', adminAuth, questionListController.getAllFlaggedQuestions);

router.get('/get/:id', questionListController.getQuestionForAnswer)

router.post('/reportQuestionByUser/:id', auth, questionListController.reportQuestionByUser);

router.post('/updateQuestion/:id', auth, questionListController.updateQuestion);

router.get('/search/:text', questionListController.search)

router.get('/searchForUser/:text', auth, questionListController.searchForUser)



module.exports = router
