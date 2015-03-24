exports.logout = function(req, res) {
    if(req.isAuthenticated()) {
        req.logout();
    }

    res.redirect('/auth/login');
};

exports.getAccessLevel = function(req, res) {
    if(req.isAuthenticated()) {
        return req.user.common.access;
    }

    return null;
};

exports.getUserInfo = function(req, res) {
    if(req.isAuthenticated()) {
        return req.user.common;
    }

    return null;
};
