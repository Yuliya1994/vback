exports.logout = function(req, res) {
    if(req.isAuthenticated()) {
        req.logout();
    }

    res.redirect('/login');
};

exports.getAccessLevel = function (req, res) {
    if(req.isAuthenticated()) {
        return req.user.common.access;
    }

    return null;
};
