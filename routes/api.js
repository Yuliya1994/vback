var express = require('express');
var router = express.Router();

var access = require('../middlewares');
var currentUserCtrl = require('../controllers/user');

var Vacation = require('../models/vacation');
var User = require('../models/user');
var Mail = require('../models/mail');

var mailer = require('../config/mailer');
var Letter = require('../config/letter');

router.use(access.apiAccess);

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

            Mail.find({state: true, 'actions.user': true, 'actions.manager': true}, function(err, mails) {
                if(err) {
                    throw err;
                }

                var receivers = '';
                var startDate = new Date(newVacation.year, newVacation.month[0], newVacation.days[0][0]);
                var endDate = null;

                if(newVacation.month[1] === null) {
                    endDate = new Date(newVacation.year, newVacation.month[0], newVacation.days[0][newVacation.days[0].length - 1]);
                } else {
                    endDate = new Date(newVacation.year, newVacation.month[1], newVacation.days[1][newVacation.days[1].length - 1]);
                }

                startDate = ('0' + (startDate.getDate())).slice(-2)+'.'+ ('0' + (startDate.getMonth())).slice(-2) +'.'+startDate.getFullYear();
                endDate = ('0' + (endDate.getDate())).slice(-2)+'.'+ ('0' + (endDate.getMonth())).slice(-2) +'.'+endDate.getFullYear();



                mails.forEach(function(receiver) {
                    receivers += receiver.subscriberEmail + ', ';
                });

                console.log(newVacation);
                console.log(startDate + ' - ' + endDate);

                var username = currentUser.profile.username || currentUser.profile.email;
                var subject = 'Пользователь '+ username +' оставил заявку на отпуск.';
                var _text = ''+ username +' желает пойти в отпуск c ' + startDate + ' по ' + endDate + '!';
                var _html = '<p><strong>'+ username +'</strong> желает пойти в отпуск c ' + startDate + ' по ' + endDate + '!</p>';

                mailer(receivers, subject, _text, _html);
            });

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

router.route('/vacation/id/:id')
    .get(function(req, res) {
        Vacation.find({_id: req.params.id}, function(err, vacation) {
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
        var updateData = {$set: {}};

        var letterType = null;

        var newLetter = new Letter();

        var toSend = null;

        if(req.body.state !== null && req.body.state !== undefined) {
            updateData.$set = { acceptionState: req.body.state};

            letterType = 'acceptionState';

            //letter start
            newLetter.setSubject('Обновлена информация о заявке на отпуск');

            if(req.body.state >= 10) {
                toSend = {state: true, 'actions.manager': true};
                newLetter.setAuthor('менеджер');

                if(req.body.state === 10) {
                    newLetter.setState('одобрена');
                } else {
                    newLetter.setState('отклонена');
                }
            } else {
                toSend = {state: true, 'actions.admin': true};
                newLetter.setAuthor('администратор');

                if(req.body.state === 1) {
                    newLetter.setState('принята');
                } else {
                    newLetter.setState('отклонена');
                }
            }
            //letter end

        } else if(req.body.adminComment !== null) {
            updateData.$set = { adminComment: req.body.adminComment};
            letterType = 'adminComment';

            newLetter.setSubject('Администратор оставил комментарий к вашей заявке на отпуск');
            newLetter.setComment(req.body.adminComment);
        }

        console.log(updateData);

        Vacation.update({_id:req.params.id}, updateData, function(err){
            if(err) {
                throw err;
            }

            console.log(newLetter.renderStateLetter());

            Vacation.findOne({_id:req.params.id}, function(err, data) {
                if(err) {
                    throw err;
                }

                User.findOne({'common.id': data.user_id}, function(err, user) {
                    if(err) {
                        throw err;
                    }

                    var receivers = user.common.profile.email;
                    var subject = newLetter.getSubject();

                    if(letterType === 'acceptionState') {
                        var _text = newLetter.renderStateLetter();
                        var _html = _text;
                    }

                    if(letterType === 'adminComment') {
                        var _text = newLetter.renderCommentLetter();
                        var _html = _text;
                    }

                    console.log(_html);

                    mailer(receivers, subject, _text, _html);

                })

            });


            //     var receivers = '';

            //     mails.forEach(function(receiver) {
            //         receivers += receiver.subscriberEmail + ', ';
            //     });

            //     var subject = 'Пользователь '+ username +' оставил заявку на отпуск.';
            //     var _text = ''+ username +' желает пойти в отпуск c ' + startDate + ' по ' + endDate + '!';
            //     var _html = '<p><strong>'+ username +'</strong> желает пойти в отпуск c ' + startDate + ' по ' + endDate + '!</p>';

            //


            res.status(200).end('ok');
        });
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

router.route('/mail')
    .get(function(req, res) {
        Mail.find({}, function (err, mail) {
            if (err) {
                throw err;
            }

            if (mail !== null) {
                res.status(200).end(JSON.stringify(mail));
            }

            res.status(404).end('There are no subscribers');
        })
    })
    .post(function(req, res) {
        var newMail = new Mail();
        newMail.subscriberEmail = req.body.email;
        newMail.subscriberName = req.body.name;

        newMail.save(function(err, data) {
            if(err) {
                throw err;
            }

            res.status(200).end('Добавлен');
        });
    });


router.route('/mail/:id')
    .delete(function(req, res) {
        Mail.remove({_id: req.params.id}, function(err) {
            if(err) {
                throw err;
            }

            res.status(200).end('Удален');
        });
    })
    .put(function(req, res) {
        var updateData = {$set: {}};

        console.log(req.body);

        if(!req.body.state){
           for(var a in req.body) {
               updateData.$set[a] = req.body[a];
           }
        } else {
            updateData.$set.state = req.body.state;
        }


        Mail.update({'_id':req.params.id}, updateData, function(err) {
            if(err) {
                throw err;
            }
            console.log(req.params.id);
            console.log(updateData);
            res.status(200).end('ok');
        });
    });

module.exports = router;