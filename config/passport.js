var LocalStrategy = require('passport-local').Strategy;
var User = require("../models/user");

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        })
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done){
            User.findOne({'local-email': email}, function(err, user) {
                if(err){
                    console.log(err);
                    return done(err);
                }

                if(user){
                    console.log('email is taken');
                    return done(null, false, {message: 'email is taken'})
                } else {
                    console.log('creating new user');
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = password;

                    newUser.save(function(err) {
                        if(err) {
                            console.log('not created');
                            throw err;
                        }

                        console.log('its ok');
                        return done(null, newUser);
                    });
                }
            });

        }
    ));
};