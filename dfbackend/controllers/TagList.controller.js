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
                    tagName: 1
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
                    "answer_details.removedById" : {$eq: []},
                    "question_details.removedById" : {$eq: []}
                }
            },
            {
                $project:
                    {
                        tagName: 1,
                        
                        question: "$question_details.question",

                        property: {
                            $cond: 
                            { if: 
                                { $eq: "$answer_details.answer" }, 
                                then: 
                                    {answer: "$answer_details.answer"}, 
                                else: 
                                    {question: "$question_details.question"} 
                            }
                        },  
                        
                        tagList: {
                            $cond: 
                            { if: 
                                { $eq: "$answer_details.tagsForAnswer" }, 
                                then: 
                                    {tagsForAnswer: "$answer_details.tagsForAnswer"}, 
                                else: 
                                    {tagsForQuestion: "$question_details.tagsForQuestion"} 
                            }
                        }       
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


module.exports = tagController = {
    getAllTagNames,
    getTagDetails
};
