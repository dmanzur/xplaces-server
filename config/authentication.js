var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const usersDBManager = require('../models/user');
var utils = require('../utils');

passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    usersDBManager.findUserById(id,function(err,user){
        done(err,user);
    })
});

passport.use(new LocalStrategy(
    {usernameField:"email", passwordField:"password"},
    function(email,password,done){
        console.log("in passport");
        console.log(email + " " + password);
        usersDBManager.findUserByEmail(email,function(err,user){
            if(err) {
                console.log("err find user email in db");
                return done(err);
            }
            if (!user) {
                console.log("user email not found in db");
                return done(null,false,{message:"incorrect email"})
            }
            else {
                utils.comparePassword(password,user.password,function(err,isMatch){
                    if (isMatch){
                        return done(null,user);
                    }
                    else {
                        console.log("user password not correct");
                        return done(null,false,{message:"incorrect password"})
                    }
                });
            }
        });
    }
));


module.exports.login = function(){
    return passport.authenticate('local');
};