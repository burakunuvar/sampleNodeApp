//jshint esversion:6
const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");


// ======== CAMPGROUND ROUTES ARE STARTING HERE==========
//RESTAPI: 1-GET; request made to index.ejs
// router.get("/movies", (req, res) => {
router.get("/", (req, res) => {
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
// router.get("/movies/newMovie", (req, res) => {
router.get("/newMovie",isLoggedIn, (req, res) => {
  console.log("**** RESTAPI: 2-GET form ; request made to newMovie.ejs ");
  res.render("movies/newMovie");
});

//RESTAPI: 3-POST ; request made to index.ejs
// router.post("/movies", (req, res) => {
router.post("/",isLoggedIn, (req, res) => {
console.log("**** RESTAPI: 3-POST ; request made to index.ejs ");
  var newMovie={
    title: req.body.title,
    image: req.body.image,
    description: req.body.description,
    author: {
      id: req.user._id,
      username: req.user.username,
    },
  };
  newMovie.author.id = req.user._id;
  newMovie.author.username = req.user.username;
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
// router.get("/movies/:id",function(req,res){
router.get("/:id",function(req,res){
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
// ======== CAMPGROUND ROUTES ARE  STARTING HERE==========

//middleware function for authentication check

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    console.log("MIDDLEWARE RUNNING SUCCESSFULLY, NEXT");
    return next();
  }else{
    console.log("MIDDLEWARE FAILED");
    res.redirect("/login");
  }
}

module.exports = router ;
