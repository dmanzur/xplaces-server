const express = require('express');
var utils = require('../utils');
var router = express.Router();
var findPlaceIdByImageHandler  = require('../handlers/findPlaceIdByImageHandler');
var multer  = require('multer');
const placesDBManager = require("../models/place");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, utils.generateHash() + '.png')
    }
});
var upload = multer({ storage: storage });


//=>server/places/find
router.post('/find', upload.single('img'), (req, res) => {

    console.log('in find');
    const imageUrl = 'http://193.106.55.94:8080/' + req.file.path;
    const fileName = req.file.filename;
    findPlaceIdByImageHandler.findPlace(imageUrl, function (placeId, err) {
        console.log(fileName);
        utils.deleteUploadedFile(fileName);
        if (err) {
            console.log("find place return error");
            res.send(err);
        }
        else {
            res.send({value:placeId});
        }
    });
});

//=>server/places
router.get('/',(req,res)=>{

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
});

module.exports = router;