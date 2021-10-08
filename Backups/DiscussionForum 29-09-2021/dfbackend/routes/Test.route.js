const express = require('express');
const router = express.Router();
const Test = require('../models/Test.model')
// const auth = require('../middleware/auth')

router.post('/', async (req, res) => {
    try {

        const {testString} = req.body;

        const newTest = new Test({testString});

        const savedTest = await newTest.save();
        return res.json(savedTest);


    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
})

module.exports = router