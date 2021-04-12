// Koneksi MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/challenge', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=>{
    console.log('CONNECTION OPEN!');
  })
  .catch(err =>{
    console.log('ERROR');
    console.log(err);
  });

module.exports = mongoose;