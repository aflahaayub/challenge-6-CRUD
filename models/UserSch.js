const mongoose = require('mongoose');
const Biodata = require('./BiodataSch');
const History = require('./HistorySch');
const Schema = require('mongoose').Schema;

const UserSchema = new mongoose.Schema({
  name:{
    type:String,
    requires: true
  },
  username:{
    type:String,
    requires: true
  },
  password:{
    type:String,
    requires: true
  },
  email:{
    type:String,
    requires: true
  },
  biodata:{
    type: Schema.Types.ObjectId, 
    ref: 'Biodata'
  },
  history:{
    type: Schema.Types.ObjectId,
    ref: 'History'
  }
});

module.exports = mongoose.model('User', UserSchema);