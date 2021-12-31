const express = require('express');
const router = express.Router();
const Comment = require('../models/CommentList.model')
const auth = require('../middleware/auth')
const mongoose = require('mongoose')

router.post('/addComment/:id', auth, async (req, res) => {

    try {

        const answerId = mongoose.Types.ObjectId(req.params.id)
        const userId = mongoose.Types.ObjectId(req.user)

        const comment = req.body

        
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

})

module.exports = router