const express = require('express');
const router = express.Router();
const Question = require('../models/QuestionList.model')
const auth = require('../middleware/auth')
const mongoose = require('mongoose')

router.post('/post', auth, async (req, res) => {


    const submittedQuestion = new Question({
        questionById: req.user,
        question: req.body.question
    })
    submittedQuestion.save()
    .then(data => {
        res.json({message: 'Question submitted successfully'})
    })
    .catch(err => {
        res.json({message: 'Error submitting question'})
    })

})

router.post('/addView/:id', auth, async (req, res) => {

    let questionId = mongoose.Types.ObjectId(req.params.id)
    let userId = mongoose.Types.ObjectId(req.user)
    
    Question.findOneAndUpdate(
        {
            _id: questionId
        }, 
        {
            $addToSet: 
            {
                viewedById: userId
            }
        }
    )
    
    .then((questions) => {
        if(questions){
            res.send("Viewed successfully");
        }
        else{
            res.send("Didint view");
        }
        
    })
})



router.get('/get', async (req, res) => {
    Question.aggregate([
        {
            $lookup: 
            {
                from: 'answers', 
                localField: '_id', 
                foreignField: 'questionID',
                as: 'question_details'
            }
        },
  

        {
            $project: 
            {
                question: 1,
                answerCount: {
                    $size: "$question_details.answer"
                },

                viewCount: {
                    $size: "$viewedById"
                },

                likedById: "$question_details.likedById",
                dislikedById: "$question_details.dislikedById",

                likeCount: {
                    $size: "$question_details.likedById"
                },
                dislikeCount: {
                    $size: "$question_details.dislikedById"
                }
    
            }
        }  
    ])
    .then( (questions) => {
        if(questions){
            res.json(questions);
        }
        else{
            res.json({question: "Error"})
        }
    })
});


router.get('/get/:id', async (req, res) => {
    let id = req.params.id;
    Question.findById(id, function (err, questions) {
        res.json(questions);
    })
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
