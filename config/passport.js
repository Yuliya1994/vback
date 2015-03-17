var LocalStrategy = require('passport-local').Strategy;
var User = require("../models/user");

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
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

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err) {
                    console.log(err);
                    return done(err);
                }

                // if no user is found, return the message
                if (!user) {
                    console.log('user doesnt exist');
                    return done(null, false); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (user.local.password !== password) {
                    console.log('password isnt correct');
                    return done(null, false); // create the loginMessage and save it to session as flashdata
                }

                // all is well, return successful user
                console.log('its ok');
                return done(null, user);
            });

        }));
};