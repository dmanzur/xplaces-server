var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var keys = require('./config/keys');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');

var usersRouter = require('./routes/users');
var placesRouter = require('./routes/places');
var managerRouter = require('./routes/manager');
const cookieSession = require('cookie-session');

var app = express();

require('./db');
var cors = require('cors');
app.use(cors())


app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret:'secret',
    saveUninitialized: true,
    resave: true
}));

//initiialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/uploads',express.static(path.join(__dirname, '/uploads')));
app.use('/places', placesRouter);
app.use('/users', usersRouter);
app.use('/manager', managerRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
    console.log("error");
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('respond with a error');

});


module.exports = app;
