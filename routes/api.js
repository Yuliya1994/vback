var express = require('express');
var router = express.Router();

var access = require('../middlewares');
var currentUserCtrl = require('../controllers/user');

var Vacation = require('../models/vacation');
var User = require('../models/user');

//router.use(access.apiAccess);

router.route('/vacation')
    .get(function(req, res) {
        Vacation.find({}, function(err, data) {
            if(err) {
                throw err;
            }

            if(data === null) {
                res.status(404).end('Sorry, there are no vacations yet');
            }

            res.status(200).end(JSON.stringify(data));
        });
    })
    .post(function(req, res){
        var currentUser = currentUserCtrl.getUserInfo(req, res); // common info

        var newVacation = new Vacation();
        newVacation.user_id = currentUser.id;
        newVacation.rank = currentUser.rank;
        newVacation.month = req.body.month;
        newVacation.days = req.body.days;
        newVacation.year = req.body.year;
        newVacation.comment = req.body.comment;

        newVacation.save(function(err, data) {
            if(err){
                throw err;
            }

            res.status(200).send('Заявка отправлена \n' + data);
        });
    });

router.get('/vacation/:user_id', function(req, res) {
    Vacation.find({user_id: req.params.user_id}, function(err, vacation) {
        if(err) {
            throw err;
        }
        if(vacation !== null) {
            res.status(200).end(JSON.stringify(vacation));
        }

        res.status(404).end('These vacations doesn\'t exist');

    });
});

router.route('/vacation/:id')
    .get(function(req, res) {
        Vacation.findOne({_id: req.params.id}, function(err, vacation) {
            if(err) {
                throw err;
            }

            if(vacation !== null) {
                res.status(200).end(JSON.stringify(vacation));
            }

            res.status(404).end('This vacation doesn\'t exist');
        });
    })
    .put(function(req, res) {
        Vacation.update({_id:req.params.id}, {$set: { acceptionState: req.body.state}}, function(err){
            if(err) {
                throw err;
            }

            res.status(200).end('ok');
        });
    });

router.get('/vacation/:user', function(req, res) {

   // newVacation.

});

router.get('/user/current', function(req, res) {
        var currentUser = currentUserCtrl.getUserInfo(req, res); // common info

        User.findOne({'common.id': currentUser.id}, function(err, user) {
            if(err) {
                throw err;
            }
            if(user !== null) {
                res.status(200).end(JSON.stringify(user));
            }

            res.status(404).end('This user doesn\'t exist');
        });
    });

router.route('/user/:id')
    .get(function(req, res){
        User.findOne({'common.id': req.params.id}, function(err, user){
            if(err) {
                throw err;
            }

            if(user !== null) {
                res.status(200).end(JSON.stringify(user));
            }

            res.status(404).end('This user doesn\'t exist');
        });
    })
    .put(function(req, res) {
        var updateData = {$set: {
            'common.profile.username': req.body.username,
            'common.profile.email': req.body.email
        }};

        User.update({'common.id':req.params.id}, updateData, function(err) {
            if(err) {
                throw err;
            }

            res.status(200).end('ok');
        });
    });

module.exports = router;