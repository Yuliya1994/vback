var config = require('../config/db');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index');
    });

    app.get('/login', function(req, res) {
        res.render('login', {message: req.flash("error")});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash : true
    }));

    app.get('/signup', function(req, res) {
        res.render('signup', {message: req.flash("error")});
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash : true
    }));

    app.get('/profile', function(req, res) {
        res.render('profile', {user: req.user});
    });

    app.get('/auth/google', passport.authenticate('google'));

    app.get('/auth/google/return',
        passport.authenticate('google', { successRedirect: '/profile',
            failureRedirect: '/login' }));
};