//jshint esversion:6
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  comments : [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  author: {
   id:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
   username: String,
 }
});
const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
