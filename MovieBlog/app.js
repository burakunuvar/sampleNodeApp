//jshint esversion:6
const express = require("express");
const ejs = require('ejs');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Movie = require("./models/movie");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
const expressSanitizer = require('express-sanitizer');

seedDB();
mongoose.connect('mongodb://localhost:27017/moviesDB', {useNewUrlParser: true});

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(expressSanitizer());

app.get("/", (req, res) => {
  // console.log(__dirname) ;
  res.render("landing");
});

//RESTAPI: 1-GET; request made to index.ejs
app.get("/movies", (req, res) => {
  console.log("**** RESTAPI: 1-GET; request made to index.ejs ");
  Movie.find({},function(err,foundMovies){
    if(!err){
      res.render("movies/index", {
        renderedMovies: foundMovies
      });
    }else{
      console.log(err);
    }
  });
});

//RESTAPI: 2-GET form ; request made to newMovie.ejs
app.get("/movies/newMovie", (req, res) => {
  console.log("**** RESTAPI: 2-GET form ; request made to newMovie.ejs ");
  res.render("movies/newMovie");
});

//RESTAPI: 3-POST ; request made to index.ejs
app.post("/movies", (req, res) => {
console.log("**** RESTAPI: 3-POST ; request made to index.ejs ");
  var newMovie={
    title: req.body.title,
    image: req.body.image,
    description: req.body.description
  };
  Movie.create(newMovie,function(err,insertedMovie){
    if(!err){
      console.log(insertedMovie+" inserted successfully");
    }else{
      console.log(err);
    }
  });
  res.redirect("/movies");
});

//RESTAPI: 4-SHOW ; request made to show.ejs
app.get("/movies/:id",function(req,res){
  console.log("**** RESTAPI: 4-SHOW ; request made to show.ejs ");
  Movie.findById(req.params.id).populate("comments").exec(function(err,shownMovie){
    if(!err){
      res.render("movies/showMovie",{shownMovie:shownMovie});
      console.log(shownMovie);
    }else{
      console.log(err);
    }
  });
});


// ======== COMMENT ROUTES ARE NESTED STARTING HERE==========
// 4.b New	    /movies/:id/comments/new
app.get("/movies/:id/comments/new",(req,res)=>{
  console.log("**** Nested RESTAPI: 1.a GET request made to newCommentForm ");
  Movie.findById(req.params.id).populate("comments").exec(function(err,whichMovietoComment){
    if(!err){
      res.render("./comments/newComment",{whichMovietoComment:whichMovietoComment});
      // console.log(shownMovie);
    }else{
      console.log(err);
    }
  });
});

// 4.c Create	/movies/:id/comments
app.post("/movies/:id/comments",(req,res)=>{
  console.log("**** Nested RESTAPI: 1.b POST request made to /movies/:id/comments through newCommentForm ");
  // console.log(req.body.comment);
  req.body.comment.text = req.sanitize(req.body.comment.text);
  Comment.create(req.body.comment,function(err,insertedComment){
    if(!err){
      // console.log(insertedComment + " new comment inserted successfully");
      Movie.findById(req.params.id,function(err,movieWithNewComment){
        if(!err){
          // console.log(movieWithNewComment);
          // console.log(insertedComment);
          movieWithNewComment.comments.push(insertedComment);
          movieWithNewComment.save();
          // console.log("!!!!! COMMENTS PUSHED !!!!! ");
          // console.log(movieWithNewComment);
          res.redirect("/movies");
        }else{
          res.redirect("/movies/"+req.params.id+"/comments");
        }
      });
    }else{
      console.log(err);
    }
  });
});
// ======== COMMENT ROUTES ARE NESTED - ENDING HERE ==========

app.listen(3000, function() {
  console.log("MovieCamp started on port 3000");
});
