const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  handled: {
    type: Boolean,
    default: false
  },
  accepted: {
    type: Boolean,
    default: false
  },
  rejected: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: false
    },
    

  completed: {
    type: Boolean,
    default: false
  },
  
});

const Requests = mongoose.model('requests', requestSchema);

module.exports = Requests;
