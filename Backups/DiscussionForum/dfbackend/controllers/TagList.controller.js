const mongoose = require('mongoose')
const Tag = require('../models/TagList.model')
const Answer = require('../models/AnswerList.model')
const Question = require('../models/QuestionList.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const http = require('url');

const getAllTagNames = async (req, res) => {
    try {
        Tag.aggregate([
            {
                $project:
                {
                    value: "$tagName",
                    _id: 0
                }
            }

        ])
        .then((tags) => 
        {
            if(tags){
                res.json(tags);
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


const getTagDetails = async (req, res) => {
    try {
        let tagName = req.params.tagName;
        let userId = mongoose.Types.ObjectId(req.user)
        Tag.aggregate([
            {
                $facet:
                {
                    "questionTagDetails":[
                        {
                            $match: 
                            {
                                "tagName": tagName
                            }
                        },
                        {
                            $lookup: 
                            {
                                from: "questions", 
                                localField: "tagName", 
                                foreignField: "tagsForQuestion",
                                as: "question_details"
                            }
                        },
                        {$unwind: "$question_details"},
            
                        {
                            $match:
                            {
                                "question_details.removedById" : {$eq: []}
                            }
                        },
                        
                        //for answer count 
                        {
                            $lookup: 
                            {
                                from: 'answers', 
                                localField: 'question_details.questionID', 
                                foreignField: 'questionID',
                                as: 'question_stats'
                            }
                        },

                        //For blcoked users
                        {
                            $lookup:
                            {
                                from: 'users', 
                                localField: 'question_details.questionById', 
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
                                question: { $ifNull: [ "$question_details.question", "none" ] },
                                answerCount: {
                                    $size: "$question_stats.answer"
                                },
                
                                viewCount: {
                                    $size: "$question_details.viewedById"
                                },
                
                                likeCount: {
                                     $size: "$question_stats.likedById"
                                 },
                                 dislikeCount: {
                                     $size: "$question_stats.dislikedById"
                                 },
                                tagName: 1,
                                tagsForQuestion: { $ifNull: [ "$question_details.tagsForQuestion", "none" ] },
                                updatedOnDate: "$question_details.updatedOnDate",
                                getDate: { $dateToString: { format: "%d/%m/%Y", date: "$question_details.updatedOnDate" } }
                                
                            }
                        },
                    ],
                    
                    "answerTagDetails": [
                        {
                            $match: 
                            {
                                "tagName": tagName
                            }
                        },
                        {
                            $lookup: 
                            {
                                from: "answers", 
                                localField: "tagName", 
                                foreignField: "tagsForAnswer",
                                as: "answer_details"
                            }
                        },
                        {$unwind: "$answer_details"},
                        {
                            $match:
                            {
                                "answer_details.removedById" : {$eq: []}
                            }
                        },


                        {
                            $lookup: 
                            {
                                from: "comments", 
                                localField: "answer_details._id", 
                                foreignField: "answerId",
                                as: "comment_details"
                            }
                        },
                        {
                            $lookup: 
                            {
                                from: "users", 
                                localField: "answer_details.answeredById", 
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
                                localField: "answer_details.questionID", 
                                foreignField: "_id",
                                as: "question_details_for_answer"
                            }
                        },
                        {$unwind: "$question_details_for_answer"},

                        
                        {
                            $project:
                            {
                                type: "answer",
                                tagName: 1,
                                question: "$question_details_for_answer.question",
                                questionId: "$question_details_for_answer.questionId",
                                answer: { $ifNull: [ "$answer_details.answer", "none" ] },
                                tagsForAnswer: { $ifNull: [ "$answer_details.tagsForAnswer", "none" ] },
                                updatedOnDate: "$answer_details.updatedOnDate",
                                Class: "$user_details.Class",
                                branch: "$user_details.branch",
                                fullName: "$user_details.fullName",
                                isAdmin: "$user_details.isAdmin",
                                isCollegeId: "$user_details.isCollegeId",
                                likeCount: {
                                    $size: "$answer_details.likedById"
                                },
                                dislikeCount: {
                                    $size: "$answer_details.dislikedById"
                                },
                                commentCount: {
                                    $size: "$comment_details"
                                }
                            }
                        }
                    ]
                }
            },
            {
                $project: 
                {
                    questionsAndAnswers: 
                    {
                        $setUnion: ['$questionTagDetails', '$answerTagDetails']
                    }
                }
            },
            {
                $unwind: '$questionsAndAnswers'
            },
            {
                $replaceRoot: 
                {
                    newRoot: '$questionsAndAnswers'
                }
            },
            { $sort: { updatedOnDate: -1 } }
            
             
        ])
        .then((tags) => 
        {
            if(tags){
                res.json(tags);
                //console.log(tags);
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



const getTagDetailsForUser = async (req, res) => {
    try {
        let tagName = req.params.tagName;
        let userId = mongoose.Types.ObjectId(req.user)
        Tag.aggregate([
            {
                $facet:
                {
                    "questionTagDetails":[
                        {
                            $match: 
                            {
                                "tagName": tagName
                            }
                        },
                        {
                            $lookup: 
                            {
                                from: "questions", 
                                localField: "tagName", 
                                foreignField: "tagsForQuestion",
                                as: "question_details"
                            }
                        },
                        {$unwind: "$question_details"},
            
                        {
                            $match:
                            {
                                "question_details.removedById" : {$eq: []}
                            }
                        },
                        
                        //for answer count 
                        {
                            $lookup: 
                            {
                                from: 'answers', 
                                localField: 'question_details.questionID', 
                                foreignField: 'questionID',
                                as: 'question_stats'
                            }
                        },

                        //For blcoked users
                        {
                            $lookup:
                            {
                                from: 'users', 
                                localField: 'question_details.questionById', 
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
                                question: { $ifNull: [ "$question_details.question", "none" ] },
                                questionId: "$question_details._id",
                                answerCount: {
                                    $size: "$question_stats.answer"
                                },
                
                                viewCount: {
                                    $size: "$question_details.viewedById"
                                },
                
                                likeCount: {
                                     $size: "$question_stats.likedById"
                                 },
                                 dislikeCount: {
                                     $size: "$question_stats.dislikedById"
                                 },
                                tagName: 1,
                                tagsForQuestion: { $ifNull: [ "$question_details.tagsForQuestion", "none" ] },
                                updatedOnDate: "$question_details.updatedOnDate",
                                getDate: { $dateToString: { format: "%d/%m/%Y", date: "$question_details.updatedOnDate" } }
                                
                            }
                        },
                    ],
                    
                    "answerTagDetails": [
                        {
                            $match: 
                            {
                                "tagName": tagName
                            }
                        },
                        {
                            $lookup: 
                            {
                                from: "answers", 
                                localField: "tagName", 
                                foreignField: "tagsForAnswer",
                                as: "answer_details"
                            }
                        },
                        {$unwind: "$answer_details"},
                        {
                            $match:
                            {
                                "answer_details.removedById" : {$eq: []}
                            }
                        },


                        {
                            $lookup: 
                            {
                                from: "comments", 
                                localField: "answer_details._id", 
                                foreignField: "answerId",
                                as: "comment_details"
                            }
                        },
                        {
                            $lookup: 
                            {
                                from: "users", 
                                localField: "answer_details.answeredById", 
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
                                localField: "answer_details.questionID", 
                                foreignField: "_id",
                                as: "question_details_for_answer"
                            }
                        },
                        {$unwind: "$question_details_for_answer"},

                        {
                            $addFields:
                            {
                                "liked": {
                                    "$in": [userId, "$answer_details.likedById"]
                                },
            
                                "disliked": {
                                    "$in": [userId, "$answer_details.dislikedById"]
                                },
            
                                "saved": {
                                    "$in": [userId, "$answer_details.savedById"]
                                }
                            }
                        },
                        
                        {
                            $project:
                            {
                                type: "answer",
                                tagName: 1,
                                question: "$question_details_for_answer.question",
                                questionID: "$answer_details.questionID",
                                answerId: "$answer_details._id",
                                answer: { $ifNull: [ "$answer_details.answer", "none" ] },
                                tagsForAnswer: { $ifNull: [ "$answer_details.tagsForAnswer", "none" ] },
                                updatedOnDate: "$answer_details.updatedOnDate",
                                Class: "$user_details.Class",
                                branch: "$user_details.branch",
                                fullName: "$user_details.fullName",
                                isAdmin: "$user_details.isAdmin",
                                isCollegeId: "$user_details.isCollegeId",
                                likeCount: {
                                    $size: "$answer_details.likedById"
                                },
                                dislikeCount: {
                                    $size: "$answer_details.dislikedById"
                                },
                                commentCount: {
                                    $size: "$comment_details"
                                },
                                answeredById: "$answer_details.answeredById",
                                liked: 1,
                                disliked: 1,
                                saved: 1
                            }
                        }
                    ]
                }
            },
            {
                $project: 
                {
                    questionsAndAnswers: 
                    {
                        $setUnion: ['$questionTagDetails', '$answerTagDetails']
                    }
                }
            },
            {
                $unwind: '$questionsAndAnswers'
            },
            {
                $replaceRoot: 
                {
                    newRoot: '$questionsAndAnswers'
                }
            },
            { $sort: { updatedOnDate: -1 } }
            
             
        ])
        .then((tags) => 
        {
            if(tags){
                res.json(tags);
                //console.log(tags);
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


module.exports = tagController = {
    getAllTagNames,
    getTagDetails,
    getTagDetailsForUser
};
