
var user = require('../controllers/user');
var access = require('../middlewares.js');
var templates = require('../config/templates');


module.exports = function(app, passport) {

    app.get('/', access.isAuth, function(req, res) {
        var mainTemplate = templates[user.getAccessLevel(req, res)];

        res.render(mainTemplate, {template: mainTemplate});
    });

    app.get('/login', function(req, res) {
        res.render('login', {message: req.flash("error")});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash : true
    }));

    app.get('/logout', user.logout);

    app.get('/signup', function(req, res) {
        res.render('signup', {message: req.flash("error")});
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash : true
    }));

    app.get('/profile', access.isAuth, function(req, res) {
        res.render('profile', {user: req.user.common.profile});
    });

    app.get('/auth/google', passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/plus.login'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { successRedirect: '/',
            failureRedirect: '/login' }));

    app.get('/auth/github',
        passport.authenticate('github'));

    app.get('/auth/github/callback',
        passport.authenticate('github', { successRedirect: '/',
            failureRedirect: '/login' }));
};