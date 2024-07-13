const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName :{
        type: String,
        required: true,
    }, 
    lastName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    isAdmin :{
        type : Boolean,
        default : false,
    },
    service :{
        type : String,
        required : false,
    },
    provider :{
        type : Boolean,
        default : false,
        required : false
    },
 
})

const Users = mongoose.model('Users', userSchema);
module.exports = Users;