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


router.get('/get/:id', async (req, res) => {
try{ 
    let quesId = mongoose.Types.ObjectId(req.params.id);
    Question.aggregate([
        {
            $match: 
            {
                '_id': quesId
            }
        },

        {
            $lookup: 
            {
                from: 'users', 
                localField: 'questionById', 
                foreignField: '_id',
                as: 'user_details'
            }
        },
        {$unwind: '$user_details'},

        {
            $project: 
            {
                question: 1,
                userName: "$user_details.userName"
            }
        }
    ])
    .then((question) => 
    {
        if(question){
            res.json(question);
        }
        else {
            res.json({question: null});
        }
    })
}
catch (err) {
    console.error(err);
    res.status(500).send();
}
})


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
