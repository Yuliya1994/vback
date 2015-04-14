var mongoose = require('mongoose');

var mailSchema = mongoose.Schema({
    subscriberName: String,
    subscriberEmail: String,
    state: {type: Boolean, default: true},
    actions: {
        admin: {type: Boolean, default: true},
        manager: {type: Boolean, default: true},
        user: {type: Boolean, default: true}
    }
});

module.exports = mongoose.model('Mail', mailSchema);