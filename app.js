const express = require('express');
const app = express();
const createError = require('http-errors');
const path = require('path');
const cookiePraser = require('cookie-parser');
const logger = require('morgan');

const db = require('./config/database');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookiePraser());
app.use(express.static(path.join(__dirname, 'public')));

//call route
app.use('/', indexRouter);
app.use('/', usersRouter);

//middleware error 404
app.use((req, res, next)=>{
  res.status(404).send('Resource tidak ditemukan');
});

//middleware error 500
const errorHandling = (err, req, res, next)=>{
  console.error(err.stack);
  res.status(500).send('Terjadi kesalahan / internal server error')
};

app.use(errorHandling);

app.listen(1000, ()=>{
  console.log('RUNNING AT http://localhost:1000');
})
