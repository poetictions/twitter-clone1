const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    googleId: {type: String, required: false},
    fullname: {type: String, required: true, trim: true},
    username: {type: String, required: true, trim: true},
    password: {type: String, required: true},
    email: {type: String, required: false, trim: true},
    profilepic: {type: String, default: "/images/profilepic.png"},

}, {timestamps: true});


var User = mongoose.model("User", UserSchema);
module.exports = User;

