const mongoose = require('mongoose')

const testSchema = new mongoose.Schema({
    testString: {
        type: 'string',
        required: true
    }
})

const Test = mongoose.model('test', testSchema)
module.exports = Test;