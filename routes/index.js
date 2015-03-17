var config = require('../config/db');

module.exports = function(app, passport) {

    app.get('/', function(req, res) {
        res.render('index');
    });

    app.get('/login', function(req, res) {
        res.render('login');
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/signup'
    }));

    app.get('/signup', function(req, res) {
        console.log(config.url);
        res.render('signup');
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup'
    }));

    app.get('/profile', function(req, res) {
        res.render('profile', {user: req.user});
    });

};