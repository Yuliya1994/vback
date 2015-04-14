var user = require('../controllers/user');
var access = require('../middlewares.js');
var templates = require('../config/templates');

module.exports = function(app, passport) {

    app.get('/', access.isAuth, function(req, res) {
        var mainTemplate = templates[user.getAccessLevel(req, res)];

        res.render(mainTemplate, {template: mainTemplate});
    });

    app.get('/vacation', access.isAuth, function(req, res) {
        var mainTemplate = templates[user.getAccessLevel(req, res)];

        res.render(mainTemplate, {template: mainTemplate});
    });

    app.get('/profile', access.isAuth, function(req, res) {
        var mainTemplate = templates[user.getAccessLevel(req, res)];

        res.render(mainTemplate, {template: mainTemplate});
    });

    app.get('/list', access.isAuth, function(req, res) {
        var mainTemplate = templates[user.getAccessLevel(req, res)];

        res.render(mainTemplate, {template: mainTemplate});
    });

    app.get('/settings', access.isAuth, function(req, res) {
        var mainTemplate = templates[user.getAccessLevel(req, res)];

        res.render(mainTemplate, {template: mainTemplate});
    });

    app.get('/auth/login', function(req, res) {
        res.render('login', {message: req.flash("error")});
    });

    app.post('/auth/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash : true
    }));

    app.get('/auth/logout', user.logout);

    app.get('/auth/signup', function(req, res) {
        res.render('signup', {message: req.flash("error")});
    });

    app.post('/auth/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/auth/signup',
        failureFlash : true
    }));


    app.get('/auth/google', passport.authenticate('google',{ scope: ['https://www.googleapis.com/auth/plus.login'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { successRedirect: '/',
            failureRedirect: '/auth//login' }));

    app.get('/auth/github',
        passport.authenticate('github'));

    app.get('/auth/github/callback',
        passport.authenticate('github', { successRedirect: '/',
            failureRedirect: '/auth/login' }));

    app.get('/auth/vkontakte',
        passport.authenticate('vkontakte'));

    app.get('/auth/vkontakte/callback',
        passport.authenticate('vkontakte', { successRedirect: '/',
        failureRedirect: '/auth/login' }));
};