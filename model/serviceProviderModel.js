const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
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
    service :{
        type : String,
        required : true,
    },
    provider :{
        type : Boolean,
        default : true,
        required : false
    }
    
})

const Provider = mongoose.model('provider', providerSchema);
module.exports = Provider;