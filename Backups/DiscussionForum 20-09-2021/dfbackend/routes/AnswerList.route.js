const express = require('express');
const router = express.Router();
const Answer = require('../models/AnswerList.model')
const UserListSchemaCopy = require('../models/User.model')
const questionListSchemaCopy = require('../models/QuestionList.model')
const auth = require('../middleware/auth')


//POST ANSWER
router.post('/post', auth, async (req, res) => {
    try {
        const {questionID, answeredById, answer, answerersName} = req.body;

        if(!questionID || !answeredById || !answer || !answerersName)
            return res.status(400).json({errorMessage: 'Enter all required fields'});

        const newAnswer = new Answer({
            questionID, answeredById, answer, answerersName
        });

        const savedAnswer = await newAnswer.save();
        return res.json(savedAnswer);
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
})


/*
router.post('/post', async (req, res) => {


    const submittedAnswer = new Answer({
        questionID: req.body.questionID,
        answeredById: req.body.answeredById,
        answer: req.body.answer,
        answerersName: req.body.answerersName
    })
    submittedAnswer.save()
    // .then(data => {
    //     res.json(data)
    // })
    .then(data => {
        res.json({message: "You have successfully answered this question", isAnswered: true})

    })
    .catch(err => {
        res.json(err)
    })
})
*/


router.get('/get', async (req, res) => {
    Answer.find(function(err, answers) {
        if (err) {
            console.log(err);
        } else {
            res.json(answers);
        }
    });
});

router.get('/getCounts', async (req, res) => {
    // var questionIds = questionListSchemaCopy.aggregate([{"$project": {_id:1}}])
    Answer.find({questionID}).count()
        .then((answers) => {
            if(answers){
                res.json(answers);
            }
            else{
                res.send("ERROR");
            }
        })
})

router.get('/getAnswerCount/:id', async (req, res) => {
    let id = req.params.id;
    Answer.find({questionID: id}).count()
    .then((answers) => {
        if(answers){
            res.json({answerCount: answers});
        }
        else {
            res.json({answers: null});
        }
    })

    
})

// router.get('/getAnswerer/:id', async (req, res) => {
//     let id = req.params.id;
//     UserListSchemaCopy.find({_id: id}) 
//     .then((users) => {
//         if(users){
//             res.json(users);
//         }
//         else{
//             res.json({users: null});
//         }
//     })
// })


router.get('/get/:id', async (req, res) => {
    let id = req.params.id;
    Answer.find({questionID: id})
    .then((answers) => {
        if(answers){
            res.json(answers);
        }
        else {
            res.json({answers: null});
        }
    })

})

module.exports = router
