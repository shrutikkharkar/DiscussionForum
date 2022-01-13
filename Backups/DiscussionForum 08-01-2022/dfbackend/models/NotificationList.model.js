const mongoose = require('mongoose')

const NotificationListSchema = new mongoose.Schema({

    
    updatedOnDate: {
        type: 'date',
        default: Date.now
    }
})

module.exports = mongoose.model('notification', NotificationListSchema)