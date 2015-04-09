var mongoose = require('mongoose');

var vacationSchema = mongoose.Schema({
/*
      id: 2,
      user: "Another P.P.",
      rank: "Dev.",
      year: 2015,
      month: [3, null],
      days: [[3,4,5,6,7,8,9], null],
      comment: "Gonna go Turkey",
      acceptionState: 2
*/

    user_id: String,
    rank: Number,
    year: Number,
    month: {type: Array, default: [null, null]},
    days: {type: Array, default: [null, null]},
    comment: String,
    adminComment: {type: String, default: null},
    acceptionState: {type: Number, default: 0},
    preAcceptionState: {type: Number, default: 0}

});


module.exports = mongoose.model('Vacation', vacationSchema);