var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
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
                    return done(null, false, {message: "user doesn't exist"});
                }

                if (user.local.password !== password) {
                    return done(null, false, {message: "password isn't correct"});
                }


                return done(null, user);
            });

        }));

    passport.use(new GoogleStrategy({
        returnURL: 'http://localhost:3000/auth/google/return',
        realm: 'http://localhost:3000'
    }, function(id, profile, done){
        id = id.substr((id.indexOf('=')+1));

        User.findOne({'google.id': id}, function(err, user){
            if(err) {
                console.log('horror');
                console.log(err);
                return done(err);
            }

            if(!user) {
                var newUser = new User();
                newUser.google.id = id;
                newUser.google.profile = profile;
                newUser.local.email = profile.emails[0].value;

                newUser.save(function(err) {
                    if(err) {
                        throw err;
                    }
                });
            }

            return done(null, user||newUser);
        });
    }));
};