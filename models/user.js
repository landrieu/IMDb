const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config =require('../config/database');

//User schema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    registrationDate:{
        type: Date,
    },
    birthDate:{
        type: Date,
    },
    likedMovies:{
        type: Array,
    },
    ratedMovies:{
        type: Array,
    },
    placesSeen:{
        type: Array,
    },
    placesToSee:{
        type: Array,
    },
    description:{
        type: String,
    },
    lastConnection:{
        type: Date,
    }
});

const User = module.exports = mongoose.model('User',UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUsers = function( callback){
    User.find(callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query, callback);
}

module.exports.getNumberUsers = function(callback){
    User.count(callback);
}

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(newUser.password, salt,(err,hash)=>{
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(CandidatePassword, hash, callback){
    bcrypt.compare(CandidatePassword, hash,(err,isMatch)=>{
        if(err) throw err;
        callback(null,isMatch);
    });
}

module.exports.addLikedMovie = function(param, callback){
    User.update({"_id": param.userId},{ $set: {"likedMovies": param.likedMovies}},callback);
}
module.exports.addRatedMovie = function(param, callback){
    User.update({"_id": param.userId},{ $set: {"ratedMovies": param.ratedMovies}},callback);
}
module.exports.updateProfile = function(param, callback){
    User.update({"_id": param.id},{ $set: {
        "name": param.name,
        "email": param.email,
        "birthDate": param.birthDate,
        "description": param.description
    }},callback);
}

module.exports.addPlace = function(param, id,callback){
    if(param.seen === false){
        User.update({"_id": id},{ $push: {
        placesToSee: {
            "timeStamp": param.timeStamp,
            "longitude": param.longitude,
            "latitude": param.latitude,
            "title": param.title,
            "address": param.address
        },
        }},callback);
    }else{
         User.update({"_id": id},{ $push: {
        placesSeen: {
            "timeStamp": param.timeStamp,
            "longitude": param.longitude,
            "latitude": param.latitude,
            "title": param.title,
            "address": param.address
        },
        }},callback);
    }
    
}

module.exports.deletePlace = function(param, id,callback){
    if(param.type === "Seen"){
        User.update({"_id": id},{ $pull: {
        "placesSeen": {
            "timeStamp": param.timeStamp
            //"timeStamp": new Date(param.timeStamp)
        }}},callback);
    }else{
         User.update({"_id": id},{ $pull: {
        "placesToSee": {
            "timeStamp": param.timeStamp
            //"timeStamp": new Date(param.timeStamp)
        }}},callback);
    }
    
}

module.exports.updateUser = function(user, id,callback){
    User.update({"_id": id}, user, callback); 
}





