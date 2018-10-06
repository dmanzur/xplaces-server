var express = require('express');
var router = express.Router();
const usersDBManager = require('../models/user');
var utils = require('../utils');
var auth = require('../config/authentication');


//=>server/users/login
router.post('/login',auth.login() ,function(req, res) {
    console.log("user is logged in");
    res.send(req.user);
});


//=>server/users/logout
router.get('/logout', function(req, res) {

    req.logout();
    res.send({value:true});
});

//=>server/users/register
router.post('/register', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    usersDBManager.findUserByEmail(email, function (err, user) {
        if (user || err) {
            res.send('user email is already exist');
        }
        else {
            utils.getBcryptPassword(password, function (err, bcryptPassword) {
                if (err) {
                    console.log("cant bycrpt password");
                } else {
                    console.log(
                        "name: " + name +
                        " email: " + email +
                        " password: " + password +
                        " hash: " + bcryptPassword
                    );
                    const user = {
                        name: name,
                        email: email,
                        password: bcryptPassword
                    };
                    usersDBManager.saveUserInDB(user, function (err, newUser) {
                        if (err) {
                            res.send('error saving user in db');
                        } else {
                            res.send(newUser);
                        }
                    });
                }
            });
        }
    });
});


function ensureAuthenticate(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        console.log("user is not authenticate");
        res.send("user is not authenticate");
    }
}


//=>http://192.106.55.94:8080/users/favorites/add/placeId
router.get('/favorites/add/:placeId', ensureAuthenticate, (req, res) => {

    const userId = req.user.id;
    const placeId = req.params.placeId;
    usersDBManager.addToFavorites(userId, placeId, function (err, place) {
        if (!err) {
            console.log("add placeid to favorites return o.k");
            res.send(place);
        }
        else {
            console.log("add placeid to favorites return error");
            res.send(err.message);
        }
    });
});

//=>http://192.106.55.94:8080/users/favorites/remove/placeId
router.get('/favorites/remove/:placeId', ensureAuthenticate, (req, res) => {

    const userId = req.user.id;
    const placeId = req.params.placeId;
    usersDBManager.removeFromFavorites(userId, placeId, function (err, place) {
        if (!err) {
            console.log("remove placeid to favorites return o.k");
            res.send(place);
        }
        else {
            console.log("remove placeid from favorites return error");
            res.send(err.message);
        }
    });
});

module.exports = router;