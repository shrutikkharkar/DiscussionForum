const mongoose = require('mongoose')

const NotificationListSchema = new mongoose.Schema({

    forUserId: {
        type: mongoose.Types.ObjectId
    },

    forAdmin: {
        type: 'boolean'
    },

    fromUserId: {
        type: mongoose.Types.ObjectId
    },

    propertyId: {
        type: mongoose.Types.ObjectId
    },
    
    seen: {
        type: 'boolean'
    },

    type: {
        type: 'string',
        required: true
    },
    
    updatedOnDate: {
        type: 'date',
        default: Date.now
    }
})

module.exports = mongoose.model('notification', NotificationListSchema)