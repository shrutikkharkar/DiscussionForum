const express = require('express');
const router = express.Router();
const AnswerListSchemaCopy = require('../models/AnswerList.model')
const UserListSchemaCopy = require('../models/User.model')
const questionListSchemaCopy = require('../models/QuestionList.model')




router.post('/post', async (req, res) => {


    const submittedAnswer = new AnswerListSchemaCopy({
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

router.get('/get', async (req, res) => {
    AnswerListSchemaCopy.find(function(err, answers) {
        if (err) {
            console.log(err);
        } else {
            res.json(answers);
        }
    });
});

router.get('/getCounts', async (req, res) => {
    // var questionIds = questionListSchemaCopy.aggregate([{"$project": {_id:1}}])
    AnswerListSchemaCopy.find({questionID}).count()
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
    AnswerListSchemaCopy.find({questionID: id}).count()
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
    AnswerListSchemaCopy.find({questionID: id})
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
