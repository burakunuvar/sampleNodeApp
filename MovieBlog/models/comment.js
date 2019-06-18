//jshint esversion:6
const mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
