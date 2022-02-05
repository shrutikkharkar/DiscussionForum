const mongoose = require('mongoose')
const Question = require('../models/QuestionList.model')
const Answer = require('../models/AnswerList.model')
const Comment = require('../models/CommentList.model')
const Tag = require('../models/TagList.model')

const askQuestion = (req, res) => {
    try {
        var {tagsForQuestion} = req.body
        const submittedQuestion = new Question({
            questionById: req.user,
            question: req.body.question,
            tagsForQuestion: tagsForQuestion
        })

        //For tag
        tagsForQuestion.map(tag => {
            const addTag = new Tag({
                tagName: tag
            })
            addTag.save()
        })

        // for(var i in tagsForQuestion){
        //     const addTag = new Tag({
        //         tagName: tagsForQuestion[i]
        //     })
        //     addTag.save()
        // }
        
        

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
                $match:
                {
                    "removedById": {$eq: []}
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
            {$unwind: "$user_details"},

            {
                $match:
                {
                    "user_details.blockedById" : {$eq: []}
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
                     },

                     updatedDate: "$updatedOnDate",

                     tagsForQuestion: 1,

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
            else{
                Answer.deleteMany({questionID: quesId}, function(err, answer) {
                    if (err) throw err;
                    else {
                        Comment.deleteMany({questionId: quesId}, function(err, comment) {
                            if (err) throw err;
                            else {
                                res.send(true)
                            }
                        })
                    }
                })
            }
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
                    },
                    isBlocked: {
                        $size: "$removedById"
                    },
                    tagsForQuestion: 1,
                 
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
                $match:
                { 
                    removedById:{$exists:true}
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
                $lookup: 
                {
                    from: "users", 
                    localField: "questionById", 
                    foreignField: "_id",
                    as: "user_details"
                }
            },
            {
                $match:
                {
                    "user_details.blockedById" : {$eq: []}
                }
            },

            {
                $lookup: 
                {
                    from: "users",
                    localField: "removedById", 
                    foreignField: "_id",
                    as: "detail_of_remover"
                }
            },
            {$unwind:
                {
                    path: "$detail_of_remover", 
                    preserveNullAndEmptyArrays: true
                }
            },
            
            
            {
                $project: 
                {
                    question: 1,
                    answerCount: {
                        $size: "$question_details"
                    },

                    Class: "$user_details.Class",
                    branch: "$user_details.branch",
                    email: "$user_details.email",
                    fullName: "$user_details.fullName",
                    removed: {
                        $size: "$removedById"
                    },
                    tagsForQuestion: 1,
                    nameOfRemover: { $ifNull: [ "$detail_of_remover.fullName", "none" ] },
                    removerClass: "$detail_of_remover.Class",
                    removerBranch: "$detail_of_remover.branch"
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



const getAllBlockedQuestionDetails = async (req, res) => {
    try {
        Question.aggregate([ 
            {
                $match: 
                {
                    "removedById": {$ne: []}
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
            {$unwind: "$user_details"},

            {
                $lookup: 
                {
                    from: "users", 
                    localField: "removedById", 
                    foreignField: "_id",
                    as: "detail_of_remover"
                }
            },
            {$unwind: "$detail_of_remover"},
    
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
                    Class: "$user_details.Class",
                    branch: "$user_details.branch",
                    email: "$user_details.email",
                    fullName: "$user_details.fullName",
                    
                    answerCount: {
                        $size: "$question_details.answer"
                    },
                    nameOfRemover: "$detail_of_remover.fullName",
                    removerClass: "$detail_of_remover.Class",
                    removerBranch: "$detail_of_remover.branch",
                    tagsForQuestion: 1
                }
            }
        ])
        .then((questions) => 
        {
            if(questions){
                res.json(questions);
            }
            else {
                res.json({questions: null});
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

const getAllMeBlockedQuestionDetails = async (req, res) => {
    try {

        let userId = mongoose.Types.ObjectId(req.user);

        Question.aggregate([ 
            {
                $match: 
                {
                    "removedById": userId
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
            {$unwind: "$user_details"},
    
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
                        class: "$user_details.Class",
                        branch: "$user_details.branch",
                        email: "$user_details.email",
                        fullName: "$user_details.fullName",
                        answerCount: {
                            $size: "$question_details.answer"
                        },
                        tagsForQuestion: 1
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
}

const removeQuestionByAdmin = async (req, res) => {
    try {
        let questionId = mongoose.Types.ObjectId(req.params.id)
        let userId = mongoose.Types.ObjectId(req.user)
    
        await Question.findOneAndUpdate(
            {
                _id: questionId
            }, 
            {
                $addToSet: 
                {
                    removedById: userId
                }
            }
        )
        .then((question) => {
            if(question){
                res.send("Removed question successfully");
            }
            else{
                res.send("Didn't remove question");
            }
        })  
  
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

const unblockAnyQuestionByAdmin = async (req, res) => {
    try {
        let questionId = mongoose.Types.ObjectId(req.params.id)
    
        await Question.findOneAndUpdate(
            {
                _id: questionId
            }, 
            {
                $set: 
                {
                    removedById: []
                }
            }
        )
        .then((question) => {
            if(question){
                res.send("Unblocked question successfully");
            }
            else{
                res.send("Didn't Unblocked question");
            }
        })  
  
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

const unblockMeBlockedQuestionByAdmin = async (req, res) => {
    try {
        let questionId = mongoose.Types.ObjectId(req.params.id)
    
        await Question.findOneAndUpdate(
            {
                _id: questionId
            }, 
            {
                $set: 
                {
                    removedById: []
                }
            }
        )
        .then((question) => {
            if(question){
                res.send("Unblocked question successfully");
            }
            else{
                res.send("Didn't Unblocked question");
            }
        })  
  
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


const getQuestionForAnswer = async(req, res) => {
    try{ 
        let quesId = mongoose.Types.ObjectId(req.params.id);
        Question.aggregate([
            {
                $match: 
                {
                    '_id': quesId,
                    'removedById': {$eq: []}
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
                    userName: "$user_details.userName",
                    branch: "$user_details.branch",
                    Class: "$user_details.Class",
                    questionByEmail: "$user_details.email",
                    questionById: 1,
                    tagsForQuestion: 1
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
}


const getAllFlaggedQuestions = async (req, res) => {
    try {
        Question.aggregate([ 
            {
                $match: 
                {
                    "reportedById": {$ne: []}
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
            {$unwind: "$user_details"},

            {
                $lookup: 
                {
                    from: "users", 
                    localField: "reportedById", 
                    foreignField: "_id",
                    as: "detail_of_reporter"
                }
            },
            {$unwind: "$detail_of_reporter"},
    
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
                    Class: "$user_details.Class",
                    branch: "$user_details.branch",
                    email: "$user_details.email",
                    fullName: "$user_details.fullName",
                    
                    answerCount: {
                        $size: "$question_details.answer"
                    },
                    nameOfReporter: "$detail_of_reporter.fullName",
                    reporterClass: "$detail_of_reporter.Class",
                    reporterBranch: "$detail_of_reporter.branch",
                    removed: {
                        $size: "$removedById"
                    },
                    tagsForQuestion: 1
                }
            }
        ])
        .then((questions) => 
        {
            if(questions){
                res.json(questions);
            }
            else {
                res.json({questions: null});
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

const reportQuestionByUser = async (req, res) => {
    try {
        let questionId = mongoose.Types.ObjectId(req.params.id)
        let userId = mongoose.Types.ObjectId(req.user)
    
        await Question.findOneAndUpdate(
            {
                _id: questionId
            }, 
            {
                $addToSet: 
                {
                    reportedById: userId
                }
            }
        )
        .then((answers) => {
            if(answers){
                res.send("Reported question successfully");
            }
            else{
                res.send("Didn't report question");
            }
        })  

        const newNotification = new Notification({
            forAdmin: true,
            fromUserId: userId,
            propertyId: questionId, 
            seen: false,
            type: 'reportedQuestion'
        });

        const savedNotification = await newNotification.save();
  
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

    getAllQuestionDetails,

    getAllBlockedQuestionDetails,
    getAllMeBlockedQuestionDetails,
    removeQuestionByAdmin,
    unblockAnyQuestionByAdmin,
    unblockMeBlockedQuestionByAdmin,

    getQuestionForAnswer,

    getAllFlaggedQuestions,

    reportQuestionByUser
};