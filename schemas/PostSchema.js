const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content: { type: String, trim: true},
    postedBy: { type: Schema.Types.ObjectId, ref: 'User'},
    replyTo: {type: Schema.Types.ObjectId, ref: "Post"}

}, {timestamps: true});


var User = mongoose.model("Post", PostSchema);
module.exports = User;

