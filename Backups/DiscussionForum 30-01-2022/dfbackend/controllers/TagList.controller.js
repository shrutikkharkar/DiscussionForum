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
                        {
                            $project:
                            {
                                tagName: 1,
                                question: { $ifNull: [ "$question_details.question", "none" ] },
                                tagsForQuestion: { $ifNull: [ "$question_details.tagsForQuestion", "none" ] },
                                updatedOnDate: "$question_details.updatedOnDate"
                                
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
                            $project:
                            {
                                tagName: 1,
                                answer: { $ifNull: [ "$answer_details.answer", "none" ] },
                                tagsForAnswer: { $ifNull: [ "$answer_details.tagsForAnswer", "none" ] },
                                updatedOnDate: "$answer_details.updatedOnDate"
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
                // console.log(tags);
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

// const getTagDetails = async (req, res) => {
//     try {
//         let tagName = req.params.tagName;
//         let userId = mongoose.Types.ObjectId(req.user)
//         Tag.aggregate([
//             {
//                 $match: 
//                 {
//                     "tagName": tagName
//                 }
//             },
//             {
//                 $lookup: 
//                 {
//                     from: "answers", 
//                     localField: "tagName", 
//                     foreignField: "tagsForAnswer",
//                     as: "answer_details"
//                 }
//             },
//             {$unwind: "$answer_details"},
//             {
//                 $match:
//                 {
//                     "answer_details.removedById" : {$eq: []}
//                 }
//             },
//             {
//                 $project:
//                 {
//                     tagName: 1,
//                     answer: { $ifNull: [ "$answer_details.answer", "none" ] },
//                     answerTags: { $ifNull: [ "$answer_details.tagsForAnswer", "none" ] },
                    
//                 }
//             },

//             {
//                 $lookup: 
//                 {
//                     from: "questions", 
//                     localField: "tagName", 
//                     foreignField: "tagsForQuestion",
//                     as: "question_details"
//                 }
//             },
//             {$unwind: "$question_details"},

//             {
//                 $match:
//                 {
//                     "question_details.removedById" : {$eq: []}
//                 }
//             },
//             {
//                 $project:
//                 {
//                     tagName: 1,
//                     question: { $ifNull: [ "$question_details.question", "none" ] },
//                     questionTags: { $ifNull: [ "$question_details.tagsForQuestion", "none" ] }
                    
//                 }
//             } 
//         ])
//         .then((tags) => 
//         {
//             if(tags){
//                 res.json(tags);
//                 console.log(tags);
//             }
//             else {
//                 res.json({tags: null});
//             }
//         })
//     }
//     catch (err) {
//         console.error(err);
//         res.status(500).send();
//     }
// }

module.exports = tagController = {
    getAllTagNames,
    getTagDetails
};
