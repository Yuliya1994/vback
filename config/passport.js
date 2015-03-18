var LocalStrategy = require('passport-local').Strategy;
var User = require("../models/user");

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done){
            User.findOne({'local.email': email}, function(err, user) {
                if(err){
                    return done(err);
                }

                if(user){
                    return done(null, false, {message: 'email is taken'})
                } else {
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = password;

                    newUser.save(function(err) {
                        if(err) {
                            throw err;
                        }

                        return done(null, newUser);
                    });
                }
            });

        }
    ));

    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err) {
                    console.log(err);
                    return done(err);
                }

                if (!user) {
                    console.log('user doesnt exist');
                    return done(null, false, {message: "user doesn't exist"});
                }

                if (user.local.password !== password) {
                    console.log('password isnt correct');
                    return done(null, false, {message: "password isn't correct"});
                }

                console.log('its ok');
                return done(null, user);
            });

        }));
};