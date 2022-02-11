const mongoose = require('mongoose')
const Question = require('../models/QuestionList.model')
const Answer = require('../models/AnswerList.model')
const Comment = require('../models/CommentList.model')
const Tag = require('../models/TagList.model')
const User = require('../models/User.model')
const Notification = require('../models/NotificationList.model')

const askQuestion = async (req, res) => {
    try {
        const {question, tagsForQuestion} = req.body

        //For tag
        if(tagsForQuestion.length > 0){
            tagsForQuestion.map(tag => {
                const addTag = new Tag({
                    tagName: tag
                })
                addTag.save()
            })
        }

        const submittedQuestion = new Question({
            questionById: req.user,
            question: question,
            tagsForQuestion: tagsForQuestion
        })

        const savedQuestion = await submittedQuestion.save()
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
                $lookup: 
                {
                    from: 'answers', 
                    localField: 'question_details._id', //stores answer id 
                    foreignField: '_id',
                    as: 'question_details_for_vote'
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
                        $size: "$question_details_for_vote.likedById"
                     },
                     dislikeCount: {
                         $size: "$question_details_for_vote.dislikedById"
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

const getQuestionsAndTagsForSearchBar = async (req, res) => {
    try {
        var allDetails = [];

        Question.find({}, {question: 1})
        .then((results) => {
            if(results){
                for(var i = 0; i < results.length; i++) {
                    allDetails.push(results[i])  
                }

                Tag.find({}, {tagName: 1})
                .then((results) => {
                    if(results){
                        for(var i = 0; i < results.length; i++) {
                            allDetails.push(results[i])
                        }
                        res.json(allDetails)
                    }
                    else{
                        res.send(null)
                    }

                });
            }
        });
 
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


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
                                res.send("Deleted question successfully")
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

                     removed: {
                        $size: "$removedById"
                    },

                     getDate: { $dateToString: { format: "%d/%m/%Y", date: "$updatedOnDate" } }
        
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
                },
                $set:
                {
                    reportedById: []
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
                    fullName: "$user_details.fullName",
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
            // {$unwind: "$detail_of_reporter"},
    
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
                    tagsForQuestion: 1,
                    reporterEmail: "$detail_of_reporter.email",
                    numberOfreports: {
                        $size: "$detail_of_reporter"
                    } 
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

        var allAdmins = [];
        User.find({isAdmin: true})
        .then( res => {
            for(var i = 0; i < res.length; i++){
                allAdmins.push(res[i]._id);
            }

            const newNotification = new Notification({
                forAdmin: true,
                fromUserId: userId,
                forUserId: allAdmins,
                propertyId: questionId, 
                seen: false,
                type: 'reportedQuestion'
            });

            const savedNotification = newNotification.save();
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


const updateQuestion = async (req, res) => {
    try {
        const {question, tagsForQuestion} = req.body;

        if(tagsForQuestion.length > 0) {
            tagsForQuestion.map(tag => {
                const addTag = new Tag({
                    tagName: tag
                })
                addTag.save()
            })
        }
        
        const questionId = mongoose.Types.ObjectId(req.params.id)
        const userId = mongoose.Types.ObjectId(req.user);

        Question.findOneAndUpdate(
            {
                _id: questionId,
                questionById: userId
            },
            {
                $set: 
                {
                    question: question, 
                    tagsForQuestion: tagsForQuestion
                }
            }
        )
        .then((question) => {
            if(question){
                res.send("Updated question successfully");
            }
            else{
                res.send("Didn't update question");
            }
        })  
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

// const search = async (req, res) => {
//     try {
//         let textToSearch = req.params.text

//         var searchResult = [];

//         Question.find( { $text: { $search: textToSearch } } )
//         .then((result) => {
//             if(result){
//                 for(var i = 0; i < result.length; i++){
//                     searchResult.push(result[i]);
//                 }
//                 Answer.find( { $text: { $search: textToSearch } } )
//                 .then((result) => {
//                     if(result){
//                         for(var i = 0; i < result.length; i++){
//                             searchResult.push(result[i]);
//                         }
//                         res.json(searchResult);
//                     }
//                     else{
//                         res.send("No results found")
//                     }
//                 })
//             }
//             else{
//                 res.send("No results found")
//             }
//         })

//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).send();
//     }
// }

const search = async (req, res) => {
    try {
        let textToSearch = req.params.text
        var searchResult = [];

        Question.aggregate([
            {
                $match:
                {
                    $text: { $search: textToSearch },
                    "removedById" : {$eq: []}
                }
            },
            
            //for answer count 
            {
                $lookup: 
                {
                    from: 'answers', 
                    localField: '_id', 
                    foreignField: 'questionID',
                    as: 'question_stats'
                }
            },

            //For blcoked users
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
                $project:
                {
                    type: "question",
                    question: 1,
                    tagsForQuestion: { $ifNull: [ "$tagsForQuestion", [] ] },
                    answerCount: {
                        $size: "$question_stats.answer"
                    },
                    likeCount: {
                        $size: "$question_stats.likedById"
                    },
                    dislikeCount: {
                        $size: "$question_stats.dislikedById"
                    },
                    viewCount: {
                        $size: "$viewedById"
                    },
                    updatedOnDate: 1,
                    getDate: { $dateToString: { format: "%d/%m/%Y", date: "$updatedOnDate" } }
                    
                }
            }
        ])
        .then((questionDetails) => 
        {
            if(questionDetails){
                for(var i = 0; i < questionDetails.length; i++){
                    searchResult.push(questionDetails[i]);
                }

                Answer.aggregate([
                    {
                        $match: 
                        {
                            $text: { $search: textToSearch },
                            "removedById" : {$eq: []}
                        }
                    },

                    {
                        $lookup: 
                        {
                            from: "comments", 
                            localField: "_id", 
                            foreignField: "answerId",
                            as: "comment_details"
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
                        $match:
                        {
                            "user_details.blockedById" : {$eq: []}
                        }
                    },

                    {
                        $lookup: 
                        {
                            from: "questions", 
                            localField: "questionID", 
                            foreignField: "_id",
                            as: "question_details_for_answer"
                        }
                    },
                    {$unwind: "$question_details_for_answer"},

                    
                    {
                        $project:
                        {
                            type: "answer",
                            answer: 1,
                            question: "$question_details_for_answer.question",
                            questionId: "$question_details_for_answer.questionId",
                            tagsForAnswer: { $ifNull: [ "$tagsForAnswer", [] ] },
                            updatedOnDate: 1,
                            Class: "$user_details.Class",
                            branch: "$user_details.branch",
                            fullName: "$user_details.fullName",
                            isAdmin: "$user_details.isAdmin",
                            isCollegeId: "$user_details.isCollegeId",
                            likeCount: {
                                $size: "$likedById"
                            },
                            dislikeCount: {
                                $size: "$dislikedById"
                            },
                            commentCount: {
                                $size: "$comment_details"
                            }
                        }
                    },
                    { $sort: { updatedOnDate: -1 } }
                ])
                .then((answerDetails) => 
                {
                    if(answerDetails){
                        for(var i = 0; i < answerDetails.length; i++){
                            searchResult.push(answerDetails[i]);
                        }
                        res.json(searchResult)
                    }
                    else {
                        res.json({tags: null});
                    }
                })
            }
            else {
                res.json({tags: null});
            }
        })

    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}



const searchForUser = async (req, res) => {
    try {
        const textToSearch = req.params.text
        let userId = mongoose.Types.ObjectId(req.user)
        var searchResult = [];

        Question.aggregate([
            {
                $match: 
                {
                    $text: { $search: textToSearch },
                    "removedById" : {$eq: []}
                }
            },
            
            //for answer count 
            {
                $lookup: 
                {
                    from: 'answers', 
                    localField: '_id', 
                    foreignField: 'questionID',
                    as: 'question_stats'
                }
            },

            //For blcoked users
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
                $project:
                {
                    type: "question",
                    question: 1,
                    tagsForQuestion: { $ifNull: [ "$tagsForQuestion", [] ] },
                    questionId: "$_id",
                    answerCount: {
                        $size: "$question_stats.answer"
                    },
                    likeCount: {
                        $size: "$question_stats.likedById"
                    },
                    dislikeCount: {
                        $size: "$question_stats.dislikedById"
                    },
                    viewCount: {
                        $size: "$viewedById"
                    },
                    updatedOnDate: 1,
                    getDate: { $dateToString: { format: "%d/%m/%Y", date: "$updatedOnDate" } }
                    
                }
            }
        ])
        .then((questionDetails) => 
        {
            if(questionDetails){
                for(var i = 0; i < questionDetails.length; i++){
                    searchResult.push(questionDetails[i]);
                }

                Answer.aggregate([
                    {
                        $match: 
                        {
                            $text: { $search: textToSearch },
                            "removedById" : {$eq: []}
                        }
                    },

                    {
                        $lookup: 
                        {
                            from: "comments", 
                            localField: "_id", 
                            foreignField: "answerId",
                            as: "comment_details"
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
                        $match:
                        {
                            "user_details.blockedById" : {$eq: []}
                        }
                    },

                    {
                        $lookup: 
                        {
                            from: "questions", 
                            localField: "questionID", 
                            foreignField: "_id",
                            as: "question_details_for_answer"
                        }
                    },
                    {$unwind: "$question_details_for_answer"},

                    {
                        $addFields:
                        {
                            "liked": {
                                "$in": [userId, "$likedById"]
                            },
        
                            "disliked": {
                                "$in": [userId, "$dislikedById"]
                            },
        
                            "saved": {
                                "$in": [userId, "$savedById"]
                            }
                        }
                    },
                    
                    {
                        $project:
                        {
                            type: "answer",
                            question: "$question_details_for_answer.question",
                            questionID: "$questionID",
                            answerId: "$_id",
                            answer: { $ifNull: [ "$answer", "none" ] },
                            tagsForAnswer: { $ifNull: [ "$tagsForAnswer", [] ] },
                            updatedOnDate: "$updatedOnDate",
                            Class: "$user_details.Class",
                            branch: "$user_details.branch",
                            fullName: "$user_details.fullName",
                            isAdmin: "$user_details.isAdmin",
                            isCollegeId: "$user_details.isCollegeId",
                            likeCount: {
                                $size: "$likedById"
                            },
                            dislikeCount: {
                                $size: "$dislikedById"
                            },
                            commentCount: {
                                $size: "$comment_details"
                            },
                            answeredById: "$answeredById",
                            liked: 1,
                            disliked: 1,
                            saved: 1
                        }
                    },
                    { $sort: { updatedOnDate: -1 } }
                ])
                .then((answerDetails) => 
                {
                    if(answerDetails){
                        for(var i = 0; i < answerDetails.length; i++){
                            searchResult.push(answerDetails[i]);
                        }
                        res.json(searchResult)
                    }
                    else {
                        res.json({tags: null});
                    }
                })
            }
            else {
                res.json({tags: null});
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

    getAllQuestionDetails,

    removeQuestionByAdmin,
    unblockAnyQuestionByAdmin,

    getQuestionForAnswer,

    getAllFlaggedQuestions,

    reportQuestionByUser,

    updateQuestion,
    getQuestionsAndTagsForSearchBar,

    search,
    searchForUser
};