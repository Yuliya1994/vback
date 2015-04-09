var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var compress = require('compression');
var staticCache = require('express-static-cache')

var methodOverride = require('method-override');
var fs = require('fs');
var logger = require('morgan');

var mongoose = require('mongoose');
var config = require('./config/db');
mongoose.connect(config.url);

var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var apiRouter = require('./routes/api');


var app = express();
app.use(compress({'level': 9}));

app.set('views', path.join(__dirname, 'views'));
app.use('/bower_components',  staticCache(__dirname + '/bower_components', { maxAge: 365 * 24 * 60 * 60 }));
app.set('view engine', 'jade');

app.use(staticCache(path.join(__dirname, 'public'), { maxAge: 365 * 24 * 60 * 60 }));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(cookieParser());
app.use(session({
    secret: 'oi928%@21jdfdsJd',
    resave: true,
    saveUninitialized: true
}));

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var accessLogStream = fs.createWriteStream('access.log', {flags: 'a'});
app.use(logger('combined', {stream: accessLogStream}));

//main routes
var routes = require('./routes/index')(app, passport);


//indus
app.use('/profile', function(req, res){
    res.sendFile(__dirname + '/public/templates/main-user.html');
});
app.use('/vacation', function(req, res){
    res.sendFile(__dirname + '/public/templates/main-user.html');
});


app.use('/api', apiRouter);
//api routes

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
setInterval(function() {
    console.log(process.memoryUsage());
} ,1000);



module.exports = app;