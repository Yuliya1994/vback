var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var fs = require('fs');
var logger = require('morgan');

var mongoose = require('mongoose');
var config = require('./config/db');
mongoose.connect(config.url);

var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;


var users = require('./routes/users');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(cookieParser());
app.use(session({
    secret: 'oi928%@21jdfdsJd'
}));

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

var accessLogStream = fs.createWriteStream('access.log', {flags: 'a'});
app.use(logger('combined', {stream: accessLogStream}));

var routes = require('./routes/index')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});


module.exports = app;