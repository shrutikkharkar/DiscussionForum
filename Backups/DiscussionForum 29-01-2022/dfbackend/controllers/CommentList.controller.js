const mongoose = require('mongoose')
const Comment = require('../models/CommentList.model')
const Notification = require('../models/NotificationList.model')

const addComment = async (req, res) => {
    try {

        const answerId = mongoose.Types.ObjectId(req.params.id)
        const userId = mongoose.Types.ObjectId(req.user)

        const {comment, questionID, answeredById} = req.body

        // Logic for notification
        const newNotification = new Notification({
            forUserId: answeredById,
            fromUserId: userId,
            propertyId: answerId, 
            seen: false,
            type: 'commented'
        });

        const savedNotification = await newNotification.save();
        // Logic for notification

        if(!comment)
            return res.status(400).json({errorMessage: 'Enter all required fields'});

        const newComment = new Comment({
            answerId: answerId, commentById: userId, comment: comment, questionId: questionID
        });

        const savedComment = await newComment.save();
        // return res.json(savedComment);
        return res.send("Comment added successfully!");

        
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
                $lookup: 
                {
                    from: "answers", 
                    localField: "answerId", 
                    foreignField: "_id",
                    as: "answer_details"
                }
            },

    
            {
                $project:
                {
                    answer : "$answer_details.answer",
                    comment: 1,
                    Class: "$user_details.Class",
                    branch: "$user_details.branch",
                    fullName: "$user_details.fullName",
                    isAdmin: "$user_details.isAdmin"
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


const getCommentsForUser = async (req, res) => {

    try {
        let answerId = mongoose.Types.ObjectId(req.params.id);
        let userId = mongoose.Types.ObjectId(req.user);

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
                $lookup: 
                {
                    from: "answers", 
                    localField: "answerId", 
                    foreignField: "_id",
                    as: "answer_details"
                }
            },

            {
                $addFields:
                {
                    "commentedByMe": {
                        "$eq": [userId, "$commentById"]
                    }
                }
            },

            {
                $project:
                {
                    answer : "$answer_details.answer",
                    comment: 1,
                    Class: "$user_details.Class",
                    branch: "$user_details.branch",
                    fullName: "$user_details.fullName",
                    isAdmin: "$user_details.isAdmin",
                    commentedByMe: 1
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
                $match:
                { 
                    removedById:{$exists:true}
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
                        comment: 1,
                        Class: "$user_details.Class",
                        branch: "$user_details.branch",
                        email: "$user_details.email",
                        fullName: "$user_details.fullName",
                        removed: {
                            $size: "$removedById"
                        },
                        nameOfRemover: { $ifNull: [ "$detail_of_remover.fullName", "none" ] },
                        removerClass: "$detail_of_remover.Class",
                        removerBranch: "$detail_of_remover.branch"
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
                    removedById: [],
                    reportedById: []
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


const getAllFlaggedComments = async (req, res) => {
    try {
        Comment.aggregate([ 
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
                    localField: "reportedById", 
                    foreignField: "_id",
                    as: "detail_of_reporter"
                }
            },
            {$unwind: "$detail_of_reporter"},
    
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
                    fullName: "$user_details.fullName",
                    nameOfReporter: "$detail_of_reporter.fullName",
                    reporterClass: "$detail_of_reporter.Class",
                    reporterBranch: "$detail_of_reporter.branch",
                    removed: {
                        $size: "$removedById"
                    }
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

const reportCommentByUser = async (req, res) => {
    try {
        let commentId = mongoose.Types.ObjectId(req.params.id)
        let userId = mongoose.Types.ObjectId(req.user)
    
        await Comment.findOneAndUpdate(
            {
                _id: commentId
            }, 
            {
                $addToSet: 
                {
                    reportedById: userId
                }
            }
        )
        .then((comment) => {
            if(comment){
                res.send("Reported comment successfully");
            }
            else{
                res.send("Didn't report comment");
            }
        })  

        const newNotification = new Notification({
            forAdmin: true,
            fromUserId: userId,
            propertyId: commentId, 
            seen: false,
            type: 'reportedComment'
        });

        const savedNotification = await newNotification.save();
  
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


module.exports = commentListController = {
    addComment, 
    getComments,
    getCommentsForUser,
    deleteComment,

    getAllCommentDetails,
    removeCommentByAdmin,
    unblockAnyCommentByAdmin,
    unblockMyBlockedCommentByAdmin,
    getAllBlockedCommentDetails,
    getAllMeBlockedCommentDetails,

    getAllFlaggedComments,
    reportCommentByUser
};