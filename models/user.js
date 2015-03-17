var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    local: {
        email: String,
        password: String
    }
});

userSchema.validPassword = function(password) {
    return this.local.password === password;
};

module.exports = mongoose.model('User', userSchema);