const express = require('express');
const router = express.Router();
const Answer = require('../models/AnswerList.model')
const User = require('../models/User.model')
const Question = require('../models/QuestionList.model')
const auth = require('../middleware/auth')
const mongoose = require('mongoose')

//findOneAndUpdate  $push(second arg) or $addToSet
//to remove $pull
//{$unwind: "$user_details"}

//POST ANSWER
router.post('/post', auth, async (req, res) => {
    try {
        const {questionID, answer} = req.body;

        if(!questionID || !answer)
            return res.status(400).json({errorMessage: 'Enter all required fields'});

        const newAnswer = new Answer({
            questionID, answeredById: req.user, answer
        });

        const savedAnswer = await newAnswer.save();
        return res.json(savedAnswer);
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

//LIKE DISLIKE SAVE START

router.post('/like/:id', auth, async (req, res) => {

    try {
        let answerId = mongoose.Types.ObjectId(req.params.id)
        let userId = mongoose.Types.ObjectId(req.user)

        Answer.findOneAndUpdate(
            {
                _id: answerId
            }, 
            {
                $addToSet: 
                {
                    likedById: userId
                }
            })
        .then((answers) => {
            if(answers){
                res.send("Liked successfully");
            }
            else{
                res.send("Didint like");
            }
            
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }

})


router.post('/dislike/:id', auth, async (req, res) => {

    try {
        let answerId = mongoose.Types.ObjectId(req.params.id)
        let userId = mongoose.Types.ObjectId(req.user)

        Answer.findOneAndUpdate(
            {
                _id: answerId
            }, 
            {
                $addToSet: 
                {
                    dislikedById: userId
                }
            })
        .then((answers) => {
            if(answers){
                res.send("DisLiked successfully");
            }
            else{
                res.send("Didint like");
            }
            
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }

})





router.post('/save/:id', auth, async (req, res) => {

    try {
        let answerId = mongoose.Types.ObjectId(req.params.id)
        let userId = mongoose.Types.ObjectId(req.user)

        Answer.findOneAndUpdate(
            {
                _id: answerId
            }, 
            {
                $addToSet: 
                {
                    savedById: userId
                }
            })
        .then((answers) => {
            if(answers){
                res.send("Saved successfully");
            }
            else{
                res.send("Did not like");
            }
            
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }

})


//LIKE DISLIKE SAVE END


/*
router.post('/saved/:id', auth, async (req, res) => {
    try{
        let ansId = mongoose.Types.ObjectId(req.params.id);
        let userId = mongoose.Types.ObjectId(req.user);
        Answer.post({_id: ansId}, {$set : {"savedById": userId}})
        
        .then((answers) => {
            if(answers){
                res.send("Added successfully");
            }
            else{
                res.send("Unsuccessful");
            }
            
        })

    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
})
*/



//GET LIKE DISLIKE SAVE
router.get('/getAnswered', auth, async (req, res) => {
    try{
        let userId = mongoose.Types.ObjectId(req.user);
        //let userId = "614e0dd7dc0ff04294e41d1c";

        Answer.aggregate([
        {
            $match: 
            {
                'answeredById': userId
            }
        },
        {
            $lookup: 
            {
                from: 'questions', 
                localField: 'questionID', 
                foreignField: '_id',
                as: 'answer_details'
            }
        },
        {
            $project: 
            {
                'answer_details.answersCount': 0,
                'answer_details.viewCount': 0,
                'answer_details.voteCount': 0
    
            }
        }   
        ])
        .then((answers) => {
            if(answers)
            {
                res.json(answers);
            }
            else 
            {
                res.send("Not there");
            }
        })
    }
    catch (err) 
    {
        console.error(err);
        res.status(500).send();
    }
})

router.get('/getSaved', auth, async (req, res) => {
    try {

        let userId = mongoose.Types.ObjectId(req.user)

        Answer.aggregate([
            {$match: {"savedById": userId}}, 
            {
                $lookup: 
                {
                    from: "questions", 
                    localField: "questionID", 
                    foreignField: "_id",
                    as: "answer_details"
                }
            },
            {
                $project: 
                {
                    "answer_details.answersCount": 0,
                    "answer_details.viewCount": 0,
                    "answer_details.votesCount": 0
                }
            }
        ])
        .then((answers) => {
            if(answers){
                res.json(answers);
            }
            else {
                res.json({answers: null});
            }
        })

    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

router.get('/getLiked', auth, async (req, res) => {
    try {

        let userId = mongoose.Types.ObjectId(req.user)

        Answer.aggregate([
            {
                $match: 
                {
                    "likedById": userId
                }
            }, 
            {
                $lookup: 
                {
                    from: "questions", 
                    localField: "questionID", 
                    foreignField: "_id",
                    as: "answer_details"
                }
            },
            {
                $project: 
                {
                    "answer_details.answersCount": 0,
                    "answer_details.viewCount": 0,
                    "answer_details.votesCount": 0
                }
            }
        ])
        .then((answers) => {
            if(answers){
                res.json(answers);
            }
            else {
                res.json({answers: null});
            }
        })

    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

//GET LIKE DISLIKE SAVE END





/*
router.post('/post', async (req, res) => {


    const submittedAnswer = new Answer({
        questionID: req.body.questionID,
        answeredById: req.body.answeredById,
        answer: req.body.answer
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



// router.get('/get/:id', async (req, res) => {
//     try{
//         let id = mongoose.Types.ObjectId(req.params.id);

//         Answer.aggregate([
//             {
//                 $match: 
//                 {
//                     "questionID": id
//                 }
//             }, 
//             {
//                 $lookup: 
//                 {
//                     from: "users", 
//                     localField: "answeredById", 
//                     foreignField: "_id",
//                     as: "user_details"
//                 },
//                 $lookup:
//                 {
//                     from: "answers", 
//                     localField: "_id", 
//                     foreignField: "_id",
//                     as: "answer_stats"
//                 }
//             },
//             {
//                 $project:  
//                 {
//                     "user_details.fullName": 0,
//                     "user_details.password": 0,
//                     "user_details.email": 0,
//                     "answer_stats.likeCount": {
//                         $size: "$likedById"
//                     },
//                     "answer_stats.dislikeCount": {
//                         $size: "$dislikedById"
//                     }
//                 }
//             }
//         ])
//         .then((answers) => {
//             if(answers){
//                 res.json(answers);
//             }
//             else {
//                 res.json({answers: null});
//             }
//         })
//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).send();
//     }
// })


// router.get('/get/:id', async (req, res) => {
//     try{
//         let id = mongoose.Types.ObjectId(req.params.id);

//         Answer.aggregate([
//             {
//                 $match: 
//                 {
//                     "questionID": id
//                 }
//             }, 
//             {
//                 $lookup: 
//                 {
//                     from: "users", 
//                     localField: "answeredById", 
//                     foreignField: "_id",
//                     as: "user_details"
//                 },
//                 $lookup:
//                 {
//                     from: "answers", 
//                     localField: "_id", 
//                     foreignField: "_id",
//                     as: "answer_stats"
//                 }
//             },
//             {
//                 $project:  
//                 {
//                     "user_details.fullName": 0,
//                     "user_details.password": 0,
//                     "user_details.email": 0
//                 },
//                 $project:
//                 {
//                     likeCount: {
//                         $size: "$likedById"
//                     },
//                     dislikeCount: {
//                         $size: "$dislikedById"
//                     }
//                 }
//             }
//         ])
//         .then((answers) => {
//             if(answers){
//                 res.json(answers);
//             }
//             else {
//                 res.json({answers: null});
//             }
//         })
//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).send();
//     }
// })
    
    

router.get('/get/:id', async (req, res) => {
try{
    let id = mongoose.Types.ObjectId(req.params.id);
    Answer.aggregate([
        {
            $match: 
            {
                "questionID": id
            }
        }, 
        {
            $lookup: 
            {
                from: "users", 
                localField: "answeredById", 
                foreignField: "_id",
                as: "user_details"
            }
        },
        {$unwind: "$user_details"},

        {
            $lookup: 
            {
                from: "answers", 
                localField: "_id", 
                foreignField: "_id",
                as: "answer_stats"
            }
        },
        {$unwind: "$answer_stats"},

        {
            $project:
            {
                    answer: 1,
                    Class: "$user_details.Class",
                    branch: "$user_details.branch",
                    userName: "$user_details.userName",
                    likeCount: {
                        $size: "$answer_stats.likedById"
                    },
                    dislikeCount: {
                        $size: "$answer_stats.dislikedById"
                    }
            }
        }
    ])
    .then((answers) => 
    {
        if(answers){
            res.json(answers);
        }
        else {
            res.json({answers: null});
        }
    })
}
catch (err) {
    console.error(err);
    res.status(500).send();
}
})

// router.get('/getAnswerStats/:id', async (req, res) => {
//     try{
//             let id = mongoose.Types.ObjectId(req.params.id);
    
//             Answer.aggregate([
//                 {
//                     $match: 
//                     {
//                         "questionID": id
//                     }
//                 }, 
//                 {
//                     $lookup: 
//                     {
//                         from: "answers", 
//                         localField: "_id", 
//                         foreignField: "_id",
//                         as: "answer_stats"
//                     }
//                 },
//                 {
//                     $project: 
//                     {
//                         likeCount: {
//                             $size: "$likedById"
//                         },
//                         dislikeCount: {
//                             $size: "$dislikedById"
//                         }
//                     }
//                 }
//             ])
//             .then((answers) => {
//                 if(answers){
//                     res.json(answers);
//                 }
//                 else {
//                     res.json({answers: null});
//                 }
//             })
//         }
//         catch (err) {
//             console.error(err);
//             res.status(500).send();
//         }
//     })
    


/*
router.get('/get/:id', async (req, res) => {
    let id = req.params.id;
    Answer.find({questionID: id})
    .then((answers) => {
        
        if(answers){

        }
        else {
            res.json({answers: null});
        }
    })

})
*/

router.get('/getCounts', async (req, res) => {
    // var questionIds = Question.aggregate([{"$project": {_id:1}}])
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
//     User.find({_id: id}) 
//     .then((users) => {
//         if(users){
//             res.json(users);
//         }
//         else{
//             res.json({users: null});
//         }
//     })
// })




module.exports = router
