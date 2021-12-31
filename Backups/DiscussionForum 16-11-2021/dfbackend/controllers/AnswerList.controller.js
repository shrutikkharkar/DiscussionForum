const mongoose = require('mongoose')
const Answer = require('../models/AnswerList.model')

const postAnswer = async (req, res) => {
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
};


const deleteAnswer = async (req, res) => {
    try {
        const answerId = mongoose.Types.ObjectId(req.params.id);
        const userId = mongoose.Types.ObjectId(req.user);

        Answer.findOneAndDelete({_id: answerId, answeredById: userId})
        .then((answers) => {
            if(answers){
                res.send("Answer deleted successfully");
            }
            else{
                res.send("Didint delete");
            }
        })

    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

//LIKE DISLIKE SAVE START
const likeAnswer = async (req, res) => {
    try {
        let answerId = mongoose.Types.ObjectId(req.params.id)
        let userId = mongoose.Types.ObjectId(req.user)
    
        await Answer.findOneAndUpdate(
            {
                _id: answerId
            }, 
            {
                $pull: 
                {
                    dislikedById: userId
                },
                $addToSet: 
                {
                    likedById: userId
                }
            }
        )
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
};


const removeLike = (req, res) => {
    try {
        let answerId = mongoose.Types.ObjectId(req.params.id)
        let userId = mongoose.Types.ObjectId(req.user)

        Answer.findOneAndUpdate(
            {
                _id: answerId
            }, 
            {
                $pull: 
                {
                    likedById: userId
                }
            })
        .then((answers) => {
            if(answers){
                res.send("UnLiked successfully");
            }
            else{
                res.send("Didint Unlike");
            }
            
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};


const dislikeAnswer = (req, res) => {
    try {
        let answerId = mongoose.Types.ObjectId(req.params.id)
        let userId = mongoose.Types.ObjectId(req.user)

        Answer.findOneAndUpdate(
            {
                _id: answerId
            }, 
            {
                $pull: 
                {
                    likedById: userId
                },
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
                res.send("Didint dislike");
            }
            
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};


const removeDislike = (req, res) => {
    try {
        let answerId = mongoose.Types.ObjectId(req.params.id)
        let userId = mongoose.Types.ObjectId(req.user)

        Answer.findOneAndUpdate(
            {
                _id: answerId
            }, 
            {
                $pull: 
                {
                    dislikedById: userId
                }
            })
        .then((answers) => {
            if(answers){
                res.send("Removed DisLiked successfully");
            }
            else{
                res.send("Removed DisLiked UNSUCCESSFUL");
            }
            
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};


const saveAnswer = (req, res) => {
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
                res.send("Did not save");
            }
            
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};


const removeSavedAnswer = (req, res) => {
    try {
        let answerId = mongoose.Types.ObjectId(req.params.id)
        let userId = mongoose.Types.ObjectId(req.user)

        Answer.findOneAndUpdate(
            {
                _id: answerId
            }, 
            {
                $pull: 
                {
                    savedById: userId
                }
            })
        .then((answers) => {
            if(answers){
                res.send("Removed Saved successfully");
            }
            else{
                res.send("Removed Saved UNSUCCESSFUL");
            }
            
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};

//LIKE DISLIKE SAVE END

//GET LIKE DISLIKE SAVE

const getAnswered = (req, res) => {
    try{
        let userId = mongoose.Types.ObjectId(req.user);

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
        {$unwind: "$answer_details"},

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
                question: "$answer_details.question",
                answer: 1,
                likeCount: {
                    $size: "$answer_stats.likedById"
                },
                dislikeCount: {
                    $size: "$answer_stats.dislikedById"
                }
    
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
};


const getSavedAnswers = (req, res) => {
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
            {$unwind: "$answer_details"},

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
                $project: 
                {
                    question: "$answer_details.question",
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
};


const getLikedAnswers = (req, res) => {
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
            {$unwind: "$answer_details"},

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
                $project: 
                {

                    question: "$answer_details.question",
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
};


//GET LIKE DISLIKE SAVE END


const getAnswers = (req, res) => {
    Answer.find(function(err, answers) {
        if (err) {
            console.log(err);
        } else {
            res.json(answers);
        }
    })
};


const getAnswersForQuestionID = (req, res) => {
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
};


const getAnswersForUser = async (req, res) => {

    try{
        let id = mongoose.Types.ObjectId(req.params.id);
        let userId = mongoose.Types.ObjectId(req.user)
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
                $project:
                {
                        answer: 1,
                        Class: "$user_details.Class",
                        branch: "$user_details.branch",
                        userName: "$user_details.userName",
                        likeCount: {
                            $size: "$likedById"
                        },
                        dislikeCount: {
                            $size: "$dislikedById"
                        },

                        likedById: 1,
                        dislikedById: 1
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

}


module.exports = answerListController = {
    postAnswer,
    deleteAnswer,

    likeAnswer,
    removeLike,

    dislikeAnswer,
    removeDislike,

    saveAnswer,
    removeSavedAnswer,

    getAnswered,
    getSavedAnswers,
    getLikedAnswers,

    getAnswers,
    getAnswersForQuestionID,
    getAnswersForUser
};

//findOneAndUpdate  $push(second arg) or $addToSet
//to remove $pull
//{$unwind: "$user_details"}