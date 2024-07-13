const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
    feedback : {
        type : String,
        required : true
    },
    providerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users',
        required : true
    },
    
})
const Feedback = mongoose.model('feedback', feedbackSchema);
module.exports = Feedback;