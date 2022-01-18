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

router.post('/deleteQuestion/:id' , auth, questionListController.deleteQuestion);

router.get('/questioned', auth, questionListController.getUserAskedQuestions);

router.get('/getAllQuestionDetails', adminAuth, questionListController.getAllQuestionDetails);

router.get('/getAllBlockedQuestionDetails', adminAuth, questionListController.getAllBlockedQuestionDetails);

router.get('/getAllMeBlockedQuestionDetails', adminAuth, questionListController.getAllMeBlockedQuestionDetails);

router.post('/removeQuestionByAdmin/:id', adminAuth, questionListController.removeQuestionByAdmin);

router.post('/unblockAnyQuestionByAdmin/:id', adminAuth, questionListController.unblockAnyQuestionByAdmin);

router.post('/unblockMeBlockedQuestionByAdmin/:id', adminAuth, questionListController.unblockMeBlockedQuestionByAdmin);

router.get('/getAllFlaggedQuestions', adminAuth, questionListController.getAllFlaggedQuestions);

router.get('/get/:id', questionListController.getQuestionForAnswer)

router.post('/reportQuestionByUser/:id', auth, questionListController.reportQuestionByUser);

router.patch('/update/:id', auth, async (req, res) => {

    try{
        const _id = req.params.id;
        const updateQuestion = await Question.findByIdAndUpdate(_id, req.body, {
            new : true
        });
        res.send(updateQuestion)
    }
    catch(err){
        res.status(404).send(err);

    }

})

module.exports = router
