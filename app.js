var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config({ path: __dirname + "/.env" });   // Load .env file

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var chatbotRouter = require('./routes/chatbot'); // 👈 chatbot route

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chatbot', chatbotRouter); // 👈 mount chatbot API

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // ⚡ If request expects JSON (like /chatbot fetch), return JSON
  if (req.originalUrl.startsWith("/chatbot")) {
    return res.status(err.status || 500).json({ error: err.message });
  }

  // ⚡ Otherwise render error page for normal browser routes
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
