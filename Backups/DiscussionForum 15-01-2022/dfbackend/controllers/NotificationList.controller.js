const mongoose = require('mongoose')
const Notification = require('../models/NotificationList.model')

const getNotificationsForUser = async(req, res) => {
    try {
        let userId = mongoose.Types.ObjectId(req.user)
        Notification.aggregate([
            {
                $match: 
                {
                    forUserId: userId
                }
            },
            {
                $lookup:
                {
                    from: 'users', 
                    localField: 'fromUserId', 
                    foreignField: '_id',
                    as: 'user_details'
                }
            },
            {$unwind: "$user_details"},
            

            {
                $project:
                {
                    fromName: "$user_details.fullName",
                    fromClass: "$user_details.Class",
                    fromBranch: "$user_details.branch",
                    type: 1,
                    propertyId: 1
                }
            },
            {
                $sort:
                {
                    updatedOnDate : -1
                }
            }
        ])
        .then((notification) => {
            if(notification)
            {
                res.json(notification);
            }
            else 
            {
                res.json({notification: null});
            }
        })

    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

const clearAllNotifications = async(req, res) => {
    try {
        const userId = mongoose.Types.ObjectId(req.user);
        await Notification.deleteMany({
            forUserId: userId
        }, function(err, notification) {
            if (err) throw err;
            else{
                res.status(200).send('successful')
            }
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
}


module.exports = notificationListController = {
    getNotificationsForUser,
    clearAllNotifications
};