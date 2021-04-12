const mongoose = require('mongoose');
const User = require('./UserSch');
const Schema = require('mongoose').Schema;

const HistorySchema = new mongoose.Schema({
  user_id:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  username:{
    type:String
  },
  createdAt: {
    type:Date,
    default:Date.now
  },
  scors:{
    type:Number
  }
});

module.exports = mongoose.model('History', HistorySchema);