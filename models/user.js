const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    name:{type:String},
    password:{type:String},
    email:{type:String},
    favorites:[{type:String}]
});

const User = module.exports = mongoose.model('User',user);


module.exports.deleteUser = function(id,callback){
    User.findOneAndDelete({_id:id},callback);
};

module.exports.getUsers = function(callback){
    User.find({},callback);
};

module.exports.findUserByEmail= function(email,callback){
    User.findOne({email:email},callback);
};

module.exports.findUserById = function(userId,callback){
    User.findOne({_id:userId},callback);
};

module.exports.addToFavorites = function(userId,placeId,callback){
    User.updateOne({_id:userId}, { $push: {favorites: placeId } },callback);
};

module.exports.removeFromFavorites = function(userId,placeId,callback){
    User.updateOne({_id:userId}, { $pull: {favorites: placeId } },callback);
};

module.exports.saveUserInDB = function(user,callback){

    const userScheme = new User({
        name:user.name,
        password:user.password,
        email:user.email,
        favorites:[]
    });

    User.create(userScheme,callback);

};

