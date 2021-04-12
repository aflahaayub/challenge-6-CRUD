const mongoose = require('mongoose');
const User = require('./UserSch');
const Schema = require('mongoose').Schema;

const BiodataSchema = new mongoose.Schema({
  user_id:{
    type: Schema.Types.ObjectID, ref: 'User'
  },
  username:{
    type:String
  },
  name:{
    type:String
  },
  email:{
    type:String
  },
  password:{
    type:String
  }
});

module.exports = mongoose.model('Biodata', BiodataSchema);