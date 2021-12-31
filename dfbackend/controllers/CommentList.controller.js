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
                    "answerId": answerId,
                    "removedById": {$eq: []}
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
                $match:
                {
                    "user_details.blockedById" : {$eq: []}
                }
            },
    
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


const getAllCommentDetails = (req, res) => {
    try {
        Comment.aggregate([
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
                $match:
                {
                    "user_details.blockedById" : {$eq: []}
                }
            },
    
            {
                $project:
                {
                        comment: 1,
                        Class: "$user_details.Class",
                        branch: "$user_details.branch",
                        email: "$user_details.email",
                        removed: {
                            $size: "$removedById"
                        }
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

const removeCommentByAdmin = async(req, res) => {
    try {
        let commentId = mongoose.Types.ObjectId(req.params.id)
        let adminId = mongoose.Types.ObjectId(req.user)
    
        await Comment.findOneAndUpdate(
            {
                _id: commentId
            }, 
            {
                $addToSet: 
                {
                    removedById: adminId
                }
            }
        )
        .then((comment) => {
            if(comment){
                res.send("Removed comment successfully");
            }
            else{
                res.send("Didn't remove comment");
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

const unblockAnyCommentByAdmin = async (req, res) => {
    try {
        let commentId = mongoose.Types.ObjectId(req.params.id)
    
        await Comment.findOneAndUpdate(
            {
                _id: commentId
            }, 
            {
                $set: 
                {
                    removedById: []
                }
            }
        )
        .then((comment) => {
            if(comment){
                res.send("Unblocked comment successfully");
            }
            else{
                res.send("Didn't Unblocked comment");
            }
        })  
  
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

const unblockMyBlockedCommentByAdmin = async (req, res) => {
    try {
        let commentId = mongoose.Types.ObjectId(req.params.id)
    
        await Comment.findOneAndUpdate(
            {
                _id: commentId
            }, 
            {
                $set: 
                {
                    removedById: []
                }
            }
        )
        .then((comment) => {
            if(comment){
                res.send("Unblocked comment successfully");
            }
            else{
                res.send("Didn't Unblocked comment");
            }
        })  
  
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


const getAllBlockedCommentDetails = async (req, res) => {
    try {
        Comment.aggregate([ 
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
                    localField: "commentById", 
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
                    from: "comments", 
                    localField: "_id", 
                    foreignField: "_id",
                    as: "comment_stats"
                }
            },
            {$unwind: "$comment_stats"},
    
            {
                $project:
                {
                    comment: 1,
                    Class: "$user_details.Class",
                    branch: "$user_details.branch",
                    email: "$user_details.email",
                    // likeCount: {
                    //     $size: "$comment_stats.likedById"
                    // },
                    // dislikeCount: {
                    //     $size: "$comment_stats.dislikedById"
                    // },
                    nameOfRemover: "$detail_of_remover.fullName",
                    removerClass: "$detail_of_remover.Class",
                    removerBranch: "$detail_of_remover.branch"
                }
            }
        ])
        .then((comment) => 
        {
            if(comment){
                res.json(comment);
            }
            else {
                res.json({comment: null});
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


const getAllMeBlockedCommentDetails = async (req, res) => {
    try {

        let userId = mongoose.Types.ObjectId(req.user);

        Comment.aggregate([ 
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
                    localField: "commentById", 
                    foreignField: "_id",
                    as: "user_details"
                }
            },
            {$unwind: "$user_details"},
    
            {
                $lookup: 
                {
                    from: "comments", 
                    localField: "_id", 
                    foreignField: "_id",
                    as: "comment_stats"
                }
            },
            {$unwind: "$comment_stats"},
    
            {
                $project:
                {
                        comment: 1,
                        Class: "$user_details.Class",
                        branch: "$user_details.branch",
                        email: "$user_details.email",
                        // likeCount: {
                        //     $size: "$comment_stats.likedById"
                        // },
                        // dislikeCount: {
                        //     $size: "$comment_stats.dislikedById"
                        // }
                }
            }
        ])
        .then((comment) => 
        {
            if(comment){
                res.json(comment);
            }
            else {
                res.json({comment: null});
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


module.exports = commentListController = {
    addComment, 
    getComments,
    deleteComment,

    getAllCommentDetails,
    removeCommentByAdmin,
    unblockAnyCommentByAdmin,
    unblockMyBlockedCommentByAdmin,
    getAllBlockedCommentDetails,
    getAllMeBlockedCommentDetails
};