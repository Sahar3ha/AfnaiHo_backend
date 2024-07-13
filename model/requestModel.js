const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    providerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    accepted:{
        type:Boolean,
        required: false,
        default:false
    }

});

const Requests = mongoose.model('requests',requestSchema);
module.exports = Requests;