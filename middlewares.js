var user = require('./controllers/user');
exports.isAuth = function (req, res, next){
    req.isAuthenticated()
        ? next()
        : res.redirect('/login');
};

exports.isGuest = function (req, res, next){
    user.getAccessLevel() === null ? next() : res.redirect('/');
};

exports.isUser = function (req, res, next){
   user.getAccessLevel() === 1 ? next() : res.redirect('/');
};

exports.isAdmin = function (req, res, next){
    user.getAccessLevel() === 2 ? next() : res.redirect('/');
};