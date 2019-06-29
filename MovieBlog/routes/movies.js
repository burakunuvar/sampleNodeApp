//jshint esversion:6
const express = require("express");
const router = express.Router();
const Movie = require("../models/movie");
const middleware = require("../middleware/middleware");


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

//RESTAPI: 4-SHOW ; request made to showMovie.ejs
// router.get("/movies/:id",function(req,res){
router.get("/:id",function(req,res){
  console.log("**** RESTAPI: 4-SHOW ; request made to showMovie.ejs ");
  Movie.findById(req.params.id).populate("comments").exec(function(err,shownMovie){
    if(!err){
      res.render("movies/showMovie",{shownMovie:shownMovie});
      console.log(shownMovie);
    }else{
      console.log(err);
    }
  });
});

//RESTAPI: 5-EDIT ; request made to editMovie.ejs
// router.get("/movies/:id",function(req,res){
router.get("/:id/edit",checkMovieAuthorization,function(req,res){
  console.log("**** RESTAPI: 5-EDIT ; request made to editMovie.ejs ");
  Movie.findById(req.params.id, function(err,editedMovie){
    if(!err){
      res.render("movies/editMovie",{editedMovie:editedMovie});
      console.log(editedMovie);
    }else{
      console.log(err);
    }
  });
});

//RESTAPI: 6-POST ; request made to showMovie.ejs
// router.put("/movies/:id",function(req,res){
router.put("/:id",checkMovieAuthorization,function(req,res){
  console.log("**** RESTAPI: 6-PUT ; request made to showMovie.ejs ");
  Movie.findByIdAndUpdate(req.params.id,req.body.editedMovie,function(err,updatedMovie){
    if(!err){
      console.log(updatedMovie);
      res.redirect("/movies/" + req.params.id );
    }else {
      res.redirect("/movies");
    }
  });
});

//RESTAPI: 7-DELETE ; request made to showMovie.ejs
router.delete("/:id",checkMovieAuthorization,function(req,res){
  console.log("**** RESTAPI: 7-DELETE ; request made to showMovie.ejs ");
  Movie.findByIdAndRemove(req.params.id,function(err,deletedMovie){
    if(!err){
      res.redirect("/movies");
    }else{
      console.log(err);
    }
  });
});

// ======== CAMPGROUND ROUTES ARE ENDING HERE==========

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


function checkMovieAuthorization(req, res, next){
    if(req.isAuthenticated()){
        console.log("*****AUTHENTICATED*****");
        Movie.findById(req.params.id, function (err, foundMovie){
            if(err) {
                console.log("MOVIE NOT FOUND");
                res.redirect("back");
            }else {
                console.log("MOVIE FOUND");
                if(foundMovie.author.id.equals(req.user._id)){
                    console.log("*****AUTHORIZED*****");
                    next();
                }else{
                    console.log("-----NOT AUTHORIZED-----");
                    res.redirect("back");
                }
            }
        });
    }else{
      console.log("----- NOT AUTHENTICATED----");
      res.redirect("back");
    }
}


module.exports = router ;
