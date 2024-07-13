const mongoose = require('mongoose');

const favouritesSchema = new mongoose.Schema({

    
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
    
    

});

const Favourites = mongoose.model('favourites',favouritesSchema);
module.exports = Favourites;