const mongoose = require('mongoose')
const Question = require('../models/QuestionList.model')

const askQuestion = (req, res) => {
    try {
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
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

const addView = (req, res) => {
    try {
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
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};


const getQuestions = (req, res) => {
    try {
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
    
                    likeCount: {
                         $size: "$question_details.likedById"
                     },
                     dislikeCount: {
                         $size: "$question_details.dislikedById"
                     },

                     updatedDate: "$updatedOnDate",

                     getDate: { $dateToString: { format: "%d/%m/%Y", date: "$updatedOnDate" } }
        
                }
            }  
        ]).sort({updatedDate : -1})
        .then( (questions) => {
            if(questions){
                res.json(questions);
            }
            else{
                res.send(null)
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};


const deleteQuestion = async (req, res) => {
    try{
        const quesId = mongoose.Types.ObjectId(req.params.id)
        const userId = mongoose.Types.ObjectId(req.user)

        Question.deleteOne({_id: quesId, questionById: userId}, function(err, obj) {
            if (err) throw err;
          })
          .then((res) => {
              res.send(true)
          })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};


const getUserAskedQuestions = (req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.user)
        Question.aggregate([
            {
                $match:
                {
                    questionById: userId
                }
            },

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

                    likeCount: {
                         $size: "$question_details.likedById"
                     },
                     dislikeCount: {
                         $size: "$question_details.dislikedById"
                     }
                 
                }
            }
        ])
        .then((questions) => {
            if(questions){
                res.json(questions);
            }
            else{
                res.send(null);
            }

        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};


const getAllQuestionDetails = (req, res) => {
    try {
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
                $lookup: 
                {
                    from: "users", 
                    localField: "questionById", 
                    foreignField: "_id",
                    as: "user_details"
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
    
                    likeCount: {
                         $size: "$question_details.likedById"
                     },
                     dislikeCount: {
                         $size: "$question_details.dislikedById"
                     },

                    Class: "$user_details.Class",
                    branch: "$user_details.branch",
                    email: "$user_details.email"
        
                }
            }  
        ])
        .then( (questions) => {
            if(questions){
                res.json(questions);
            }
            else{
                res.send(null)
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports = questionListController = {
    askQuestion,
    addView,
    getQuestions,
    deleteQuestion,
    getUserAskedQuestions,

    getAllQuestionDetails
};