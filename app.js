var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index');
const featuresRouter = require('./routes/features');

var app = express();

// Set up mongoose connection
const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://library:ZEO5uzfoHOvpsE6n@cluster0.qkhblew.mongodb.net/powermap?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
require('./twitter/twitterServer');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/features', featuresRouter);

module.exports = app;
