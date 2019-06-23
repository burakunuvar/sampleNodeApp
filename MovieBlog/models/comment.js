//jshint esversion:6
const mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    text: String,
    author: {
     id:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
     username: String,
   }
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
