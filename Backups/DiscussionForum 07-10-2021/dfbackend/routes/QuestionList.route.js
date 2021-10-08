const express = require('express');
const router = express.Router();
const questionListTemplateCopy = require('../models/QuestionList.model')
const answerListTemplateCopy = require('../models/AnswerList.model')
const auth = require('../middleware/auth')

router.post('/post', auth, async (req, res) => {


    const submittedQuestion = new questionListTemplateCopy({
        questionById: req.user,
        question: req.body.question,
        answersCount: req.body.answersCount,
        viewCount: req.body.viewCount,
        votesCount: req.body.votesCount
    })
    submittedQuestion.save()
    .then(data => {
        res.json({message: 'Question submitted successfully'})
    })
    .catch(err => {
        res.json({message: 'Error submitting question'})
    })

    // .then(data => {
    //     res.json(data)
    // })
    // .catch(err => {
    //     res.json(err)
    // })
})

router.post('/incrementAnsCount', async (req, res) => {

    var id = req.body.id;
    questionListTemplateCopy.findOne({_id: id})
    .then((questions) => {
        if(questions){

            const incrementAns = new questionListTemplateCopy({
                answersCount: req.body.answersCount + 1
            })
            incrementAns.save()

        }
    })

    
    
})

// router.get('/get', async (req, res) => {
//     questionListTemplateCopy.find(function(err, questions) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json(questions);
//         }
//     });
// });

router.get('/get', async (req, res) => {
    questionListTemplateCopy.aggregate( [ {"$project": {question: 1} } ] )
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
    questionListTemplateCopy.findById(id, function (err, questions) {
        res.json(questions);
    })
})

router.patch('/update/:id', auth, async (req, res) => {

    try{
        const _id = req.params.id;
        const updateQuestion = await questionListTemplateCopy.findByIdAndUpdate(_id, req.body, {
            new : true
        });
        res.send(updateQuestion)
    }
    catch(err){
        res.status(404).send(err);

    }

})

module.exports = router
