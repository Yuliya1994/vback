var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var User = require("../models/user");

var GITHUB_CLIENT_ID = "9fed19d59ffcfce73c1b";
var GITHUB_CLIENT_SECRET = "78b9a3e98886090d2f8b1397f285767a4569dd3d";

var GOOGLE_CLIENT_ID = "734848012369-smap58ll438ssshkjq74325bo3m82r2s.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = 'iPrF9hHLWzKV60vG5W5hlpei';


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
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/google/callback"
    }, function(accessToken, refreshToken, profile, done){
        console.log(profile);

        User.findOne({'google.id': profile.id}, function(err, user){
            if(err) {
                console.log(err);
                return done(err);
            }

            if(!user) {
                var newUser = new User();
                newUser.google.id = profile.id;
                newUser.common.id = profile.id;

                newUser.google.profile = profile;
                newUser.common.profile = profile;

                newUser.save(function(err) {
                    if(err) {
                        throw err;
                    }
                });
            }

            return done(null, user||newUser);
        })
    }));

    passport.use(new GitHubStrategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/github/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({'github.id': profile.id}, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (!user) {
                        var newUser = new User();
                        newUser.github.id = profile.id;
                        newUser.github.profile = profile;
                        newUser.local.email = profile.emails[0].value;

                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }
                        });
                    }

                    return done(null, user || newUser);
                });
            });
        }
    ));
};