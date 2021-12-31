const mongoose = require('mongoose')
const Comment = require('../models/CommentList.model')

const addComment = async (req, res) => {
    try {

        const answerId = mongoose.Types.ObjectId(req.params.id)
        const userId = mongoose.Types.ObjectId(req.user)

        const {comment} = req.body

        
        if(!comment)
            return res.status(400).json({errorMessage: 'Enter all required fields'});

        const newComment = new Comment({
            answerId: answerId, commentById: userId, comment: comment
        });

        const savedComment = await newComment.save();
        return res.json(savedComment);
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};


const getComments = async (req, res) => {

    try {
        let answerId = mongoose.Types.ObjectId(req.params.id);
        Comment.aggregate([
            {
                $match: 
                {
                    "answerId": answerId
                }
            }, 
            {
                $lookup: 
                {
                    from: "users", 
                    localField: "commentById", 
                    foreignField: "_id",
                    as: "user_details"
                }
            },
            {$unwind: "$user_details"},
    
            {
                $project:
                {
                        comment: 1,
                        Class: "$user_details.Class",
                        branch: "$user_details.branch",
                        userName: "$user_details.userName",
                }
            }
        ])
        .then((comments) => 
        {
            if(comments){
                res.json(comments);
            }
            else {
                res.json({comments: null});
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};


const deleteComment = (req, res) => {
    try {
        const commentId = mongoose.Types.ObjectId(req.params.id);
        const userId = mongoose.Types.ObjectId(req.user);

        Comment.findOneAndDelete({_id: commentId, commentById: userId})
        .then((comments) => {
            if(comments){
                res.send("Comment deleted successfully");
            }
            else{
                res.send("Didn't delete");
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
};


module.exports = commentListController = {
    addComment, 
    getComments,
    deleteComment
};