var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    common: {
        id: String,
        access: {type: Number, default: 1},
        rank: {type: Number, default: 0},
        profile: Object,
        vacDays: {type: Number, default: 14}
    },

    local: {
        email: String,
        username: String,
        password: String
    },

    google: {
        id: String,
        profile: Object
    },

    vkontakte: {
        id: String,
        profile: Object
    },

    github: {
        id: String,
        profile: Object
    }
});

userSchema.methods.addCommonData = function(id,  profile) {
    var self = this;
    self.common.id = id||null;
    self.common.profile = profile;
};

module.exports = mongoose.model('User', userSchema);