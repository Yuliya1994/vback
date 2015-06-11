var express = require('express');
var router = express.Router();

var async = require('async');

var access = require('../middlewares');
var currentUserCtrl = require('../controllers/user');

var Vacation = require('../models/vacation');
var User = require('../models/user');
var Mail = require('../models/mail');
var   multiparty = require('multiparty');
var mailer = require('../config/mailer');
var Letter = require('../config/letter');
var fs = require('fs');
//router.use(access.apiAccess);
router.post('/upload', function (req, res) {

    var form = new multiparty.Form();
    var uploadFile = {uploadPath: '', type: '', size: 0};
    var maxSize = 2 * 1024 * 1024; //2MB
    var supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    var errors = [];

    form.on('error', function(err){
        if(fs.existsSync(uploadFile.path)) {
            fs.unlinkSync(uploadFile.path);
            console.log('error');
        }
    });

    form.on('close', function() {
        if(errors.length == 0) {
            res.send({status: 'ok', text: 'Photo uploaded successfully',path_upload:uploadFile.path.substr(8)});
        }
        else {
            if(fs.existsSync(uploadFile.path)) {
                fs.unlinkSync(uploadFile.path);
            }
            res.send({status: 'bad', errors: errors});
        }
    });

    form.on('part', function(part) {
        uploadFile.size = part.byteCount;
        uploadFile.type = part.headers['content-type'];
        uploadFile.path = './public/avatar_user/' + part.filename;

        if(uploadFile.size > maxSize) {
            errors.push('File size is ' + uploadFile.size / 1024 / 1024 + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
        }

        if(supportMimeTypes.indexOf(uploadFile.type) == -1) {
            errors.push('Unsupported mimetype ' + uploadFile.type);
        }

        if(errors.length == 0) {
            var out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
        }
        else {
            part.resume();
        }

    });


    form.parse(req);
});
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
            updateData.$set = { acceptionState: req.body.state, stateTimeStamp: Date.now()};

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

            res.status(200).end('ok');
        });
    });

router.get('/user', function(req, res) {
    User.find({}, function(err, data) {
        if(err) {
            throw err;
        }
        if(data !== null) {
            res.status(200).end(JSON.stringify(data));
        }

        res.status(404).end('No users exist');
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
            'common.profile.email': req.body.email,
            'common.rank': req.body.rank,
            'common.profile.photo': req.body.photo
        }};
        User.update({'common.id':req.params.id}, updateData, function(err) {
            if(err) {
                throw err;
            }

            res.status(200).end('ok');
        });
    })
    .delete(function(req, res) {
        var id = req.params.id;
        var errors = 0;

        console.log('try to remove');

        async.series([
            function(callback){
                User.remove({_id: id}, function(err) {
                    if(err) {
                        errors++;
                        throw err;
                    }

                    callback(null, 'user removed');
                });
            },
            function(callback){
                Vacation.remove({'user_id': id}, function(err) {
                    if(err) {
                        console.log('error');
                        throw err;
                    }

                    callback(null, 'vacations removed');


                });
            }
        ], function(err, results){
                console.log(results);
        });

        if(errors === 0) {
            res.status(200).end('ok');
        } else {
            res.status(404).end('something wrong');
        }


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