const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const place = new Schema({
    placeId:{type:String},
    name:{type:String}
});

const Place = module.exports = mongoose.model('Place',place);


module.exports.deletePlace = function(placeId,callback){
    Place.findOneAndDelete({placeId:placeId},callback);
};

module.exports.getPlaces = function(callback){
    Place.find({},callback);
};


module.exports.savePlaceInDB = function(placeId,name,callback){

    const placeScheme = new Place({
        placeId:placeId,
        name:name
    });

    Place.create(placeScheme,callback);

};

