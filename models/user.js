var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    common: {
        id: String,
        profile: Object
    },

    local: {
        email: String,
        password: String
    },

    google: {
        id: String,
        profile: Object
    },

    github: {
        id: String,
        profile: Object
    }
});

userSchema.validPassword = function(password) {
    return this.local.password === password;
};

module.exports = mongoose.model('User', userSchema);