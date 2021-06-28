var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const history = require('connect-history-api-fallback')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cors = require('cors') // 외부요청 허용
const jwt = require('jsonwebtoken'); // JWT
const passport = require('passport'); // 소셜로그인
const passportConfig = require('./passport');
var app = express();

passportConfig();
const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost:27017/nemv', { useNewUrlParser: true }, (err) => {
   if (err) return console.error(err)
   console.log('mongoose connected!')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 용량 제한 늘려주기 
app.use(express.json({ limit : "50mb" })); 
app.use(express.urlencoded({ limit:"50mb", extended: false }));

// 쿠키 시크릿키
app.use(cookieParser('cascacsfa'));
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()) // 외부요청 허용
// 소셜로그인
app.use(passport.initialize());
// app.use(passport.session());
app.use('/', indexRouter);
app.use('/api', require('./routes/api/api.js'))
app.use(history())
// be bulid 수정
app.use(express.static(path.join(__dirname, 'fe', 'dist')));
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
