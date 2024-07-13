const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    providerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    requestId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'requests'
    }
});
const Notification = mongoose.model('notification',notificationSchema);
module.exports = Notification;