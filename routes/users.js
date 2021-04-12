const express = require('express');
const client = require('../config/database');
const router = express.Router();
const User = require('../models/UserSch');
const History = require('../models/HistorySch');
const Biodata = require('../models/BiodataSch');
const app = express();
const ObjectId = require('mongodb').ObjectId;

app.use(express.json()); //middleware agar mengenal raw json from postman
app.use(express.urlencoded()); // form data from postman

// GET DATA 
router.get('/login', (req, res)=>{
  res.render('login', {title: 'Login'});
})

router.get('/register', (req, res)=>{
  res.render('register', {title: 'Register'});
})

//POST DATA REGISTER
router.post('/register', (req, res)=>{
  const{ name, username,email, password, password2} = req.body;
  let errors = [];
  if(!name || !username || !email || !password|| !password2){
    errors.push({msg: 'Silahkan lengkapi data dengan benar'});
  }
  if(password !== password2){
    errors.push({msg: 'Password tidak sama!'});
    console.log(password, password2)
  }

  if(errors.length>0){
    res.render('register', {errors, name, username, password, password2, title: 'Register'})
  }else{
    User.findOne({username: username}).then(user=>{
      if(user){
        errors.push({msg:'Username telah terdaftar'});
        res.render('register', {errors, username, title: 'Register'})
      }else{
        const newUser = new User({name, username, password});
        newUser.save().then(()=>res.redirect('/login')).catch(err=>console.log(err));

        const newHistory = new History({user_id:newUser._id, username, name, createdAt: new Date(), scors: 0});
        newHistory.save().then().catch(err=>console.log(err));

        const newBio = new Biodata({user_id:newUser._id, username, name, email, password});
        newBio.save().then().catch(err=>console.log(err));
      }
    })
  }
});

//POST DATA LOGIN
router.post('/login', async(req, res)=>{
    const {username, password} = req.body;
    let errors = [];
    let arrUser = [];
    let arrPass = [];
    if(!password || !username){
      errors.push({msg: 'Data Belum Lengkap'});
    }
    if(errors.length > 0){
      res.render('login', {errors, username, password, title: 'Login'});
    }else{
      User.findOne({username:username}).then(user=>{
          if(user){
          if(password === user.password){
            arrPass.push({password});
            res.redirect('/users/dashboard');
          }else{
            errors.push({msg:'Password anda salah, coba lagi!'});
            res.render('login', {errors, title: 'Login'})
          }
        }else{
          errors.push({msg:'Username belum terdaftar'});
          res.render('login',{errors, title: 'Login'})
        }
      })
    }
});


//DASHBOARD CRUD DATA

//READ DATA
router.get('/users/dashboard', (req, res)=>{
  let listUsers = [];
  User.find((err, users)=>{
    if(users){
      for(let user of users){
        listUsers.push({
          id: user._id,
          username: user.username,
          password: user.password
        })
      }
      res.render('users/dashboard', {listUsers, title: 'Dashboard Users'});
    }else{
      listUsers.push({
        id: "",
        username: "",
        password: ""
      });
      res.render('users/dashboard', {listUsers, title: 'Dashboard Users'});
    }
  })
});

//CREATE DATA
router.post('/users/dashboard', (req,res)=>{
  const {name, username, email, password} = req.body;
  let listUsers = [];
  let errors = [];
  User.find((err, users)=>{
    if(users){
      for(let user of users){
        listUsers.push({
          id: user._id,
          username: user.username,
          password: user.password
        })
      }
    }
  });
  if(!name || !username || !email || !password){
    errors.push({mdg: 'Lengkapi data dengan benar!'});
  }
  if(errors.length > 0){
    res.render('users/dashboard', {errors, listUsers, title: 'Dashboard'});
  }else{
    User.findOne({username: username}).then(user=>{
      if(user){
        errors.push({msg:'Username telah terdaftar'});
        res.render('users/dashboard', {errors, listUsers, title: 'Dashboard'})
      }else{
        const newUser = new User({name, username, password});
        newUser.save()
          .then(user=>{
            listUsers.push(newUser);
            errors.push({msg:'Data User Berhasil Di Tambahkan!'});
            res.render('users/dashboard', {errors, listUsers, title: 'Dashboard'});
          })
          .catch(err=>console.log(err));

          const newHistory = new History({user_id:newUser._id, username, name, createdAt: new Date(), scors: 0});
          newHistory.save().then().catch(err=>console.log(err));
  
          const newBio = new Biodata({user_id:newUser._id, username, name, email, password});
          newBio.save().then().catch(err=>console.log(err));
      }
    })
  };
});

//DELETE DATA
router.get('/users/delete/:userId', (req, res)=>{
  const userId = req.params.userId;
  Biodata.findOneAndDelete({user_id: ObjectId(userId)}, (err, data)=>{
    if(err){
      console.log(err)
    }else{
      console.log('Deleted Biodata User: ' + data);
    }
  });
  History.findOneAndDelete({user_id: ObjectId(userId)}, (err, data)=>{
    if(err){
      console.log(err)
    }else{
      console.log('Deleted History User: ' + data);
    }
  });
  User.findByIdAndDelete(req.params.userId, ()=>{
    res.redirect('/users/dashboard');
  })
});

//UPDATE DATA
router.get('/users/update/:userId', (req, res)=>{
  const userId = req.params.userId;
  res.render('users/updateUsers', {userId, title: 'Update'});
});
router.post('/users/updateUsers/:userId', (req, res)=>{
  const userId = req.params.userId;
  const {username, email, password} = req.body;
  let errors = [];

  History.updateOne({user_id:ObjectId(userId)}, {$set:{username, createdAt: new Date()}});

  Biodata.updateOne({user_id:ObjectId(userId)},{$set:{username, email, password}}, );

  User.updateOne({_id: ObjectId(userId)},{$set:{username, email, password}},(err)=>{
    if(err){
      console.log(err);
    }else{
      errors.push({msg:'Data telah di Update!'});
      const updateUser = {username, email, password};
      res.render('users/updateUsers', {userId, updateUser, errors, title: 'Updated'});
    }
  });
});


//DETAIL USER
//BIDOATA
router.get('/detail/:userId', (req, res)=>{
  const userId = req.params.userId;
  let bioUser = [];
  const query = Biodata.where({user_id: ObjectId(userId)});
  query.findOne((err, bio)=>{
    bioUser.push({
       user_id: bio.user_id,
       username: bio.username,
       name: bio.name,
       email: bio.email,
       password: bio.password
    });
    res.render('users/detail', {bioUser, userId, title: 'Biodata Users'});
  });
})
//HISTORY
router.get('/history/:userId', (req, res)=>{
  const userId = req.params.userId;
  let historyUser = [];
  const query = History.where({user_id: ObjectId(userId)});
  query.findOne((err, history)=>{
    historyUser.push({
       user_id: history.user_id,
       username: history.username,
       createdAt: history.createdAt,
       scors: history.scors
    });
    res.render('users/history', {historyUser, userId, title: 'History Users'});
  })
});


//LOGOUT
router.get('/logout', (req, res)=>{
  res.redirect('/');
});

module.exports = router;