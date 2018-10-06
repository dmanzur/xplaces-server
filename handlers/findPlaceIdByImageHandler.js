var googleService = require('../network/googleService');
var utils = require('../utils');



module.exports.findPlace = function(imageUrl,callback){


    findPlaceByImageUrl(imageUrl,function(placeName,err){
        if(err){
            callback(null,null,err);
        }
        else {
            findPlaceIdByName(placeName,function(placeId,err){
                if(err){
                    callback(null,err);
                }
                else {
                    callback(placeId,null);
                }
            })
        }
    });
};

findPlaceIdByName = function(placeName,callback){

    googleService.findPlaceIdByPlaceName(placeName,function(placePredictions,err){
        if(err){
            callback(null,err);
        }
        else {
            let placeId = null;
            let predictions = placePredictions['predictions'];
            if (predictions !== undefined && predictions.length > 0) {
            console.log("predictions length is: " + predictions.length);
            predictions.forEach((prediction) => {
                if (placeId === null && prediction['place_id'] !== undefined) {
                    placeId = prediction['place_id'];
                }
            });
            console.log("place prediction id  found: " + placeId);
            callback(placeId, null);
           }
            else {
                console.log("place prediction not found");
                callback(null,new Error('place prediction not found'));
            }
        }
    })
};



findPlaceByImageUrl = function(imageUrl,callback){

    googleService.findPlaceNameByImageUrl(imageUrl,function(placeName,err){
        if (err){
            callback(null,err);
        }
        else {

            let realName = placeName.substr(29);
            const capitalizedName = utils.capitalizeFirstLetter(realName);
            console.log("place name is: " + capitalizedName);
            callback(capitalizedName,null);
        }
    });
};