const express = require('express');
var router = express.Router();
var usersDBManager  = require('../models/user');
var placesDBManager  = require('../models/place');
var auth = require('../config/authentication');
var utils = require('../utils');
var keys = require('../config/keys');

//=>server/manager/login
router.post('/login',auth.login() ,function(req, res) {
    console.log("manager is logged in");
    utils.comparePassword(keys.manager.password,req.user.password,function(err,isMatch){
        if (isMatch){
            res.send(req.user);
        }
        else {
            console.log("user is not manager ");
            res.send(null);
        }
    });

});

//=>server/manager/logout
router.get('/logout', function(req, res) {
    req.logout();
    console.log("manager is logged out");
    res.send({value:true});
});



//=>server/manager/places
router.get('/places',(req,res)=>{

    placesDBManager.getPlaces(function(err,places){
        if (err) {
            console.log("get places return error");
            res.send(err.message);
        }
        else {
            console.log("get places return o.k");
            console.log(places);
            res.send(places);
        }
    });
});

//=>server/manager/users
router.get('/users',(req,res)=>{

    usersDBManager.getUsers(function(err,users){
        if (err) {
            console.log("get users return error");
            res.send(err.message);
        }
        else {
            console.log("get users return o.k");
            res.send(users);
        }
    });
});

router.get('/users/delete/:id',(req,res)=>{

    const id = req.params.id;
    usersDBManager.deleteUser(id,function(err,user){
        if (err) {
            console.log("delete user return error");
            res.send(err.message);
        }
        else {
            usersDBManager.getUsers(function(err,users){
                if (err) {
                    console.log("get users return error");
                    res.send(err.message);
                }
                else {
                    console.log("get users return o.k");
                    res.send(users);
                }
            });
        }
    });
});

router.get('/places/delete/:id',(req,res)=>{

    const id = req.params.id;
    placesDBManager.deletePlace(id,function(err,place){
        if (err) {
            console.log("delete place return error");
            res.send(err.message);
        }
        else {
            placesDBManager.getPlaces(function(err,places){
                if (err) {
                    console.log("get places return error");
                    res.send(err.message);
                }
                else {
                    console.log("get places return o.k");
                    res.send(places);
                }
            });
        }
    });

});

router.get('/places/add/:id/:name',(req,res)=>{

    const id = req.params.id;
    const name = req.params.name;
    placesDBManager.savePlaceInDB(id,name,function(err,place){
        if (err) {
            console.log("add place return error");
            res.send(err.message);
        }
        else {
            placesDBManager.getPlaces(function(err,places){
                if (err) {
                    console.log("get places return error");
                    res.send(err.message);
                }
                else {
                    console.log("get places return o.k");
                    res.send(places);
                }
            });
        }
    });

});




module.exports = router;