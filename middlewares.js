var user = require('./controllers/user');
exports.isAuth = function (req, res, next){
    req.isAuthenticated()
        ? next()
        : res.redirect('/auth/login');
};

exports.apiAccess = function (req, res, next) {
    req.isAuthenticated() ? next() : res.status(403).send('Access forbidden');
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