const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const fs = require("fs");



module.exports.generateHash = function(){
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
    return hash;
};

module.exports.getBcryptPassword = function(password,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(password,salt,callback);
    })
};

module.exports.comparePassword = function (candidatePassword,hash,callback){
    console.log("comparePassword");
    bcrypt.compare(candidatePassword,hash,callback);
}

module.exports.capitalizeFirstLetter = function(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
};


module.exports.deleteUploadedFile = function(uploadedFileName){
    fs.unlink('./uploads/'+uploadedFileName, (err) => {
        if (err) {
            console.log('error deleting uploaded file');
            console.log(err.message);
        }
        else {
            console.log('Uploaded file deleted');
        }
    });

};