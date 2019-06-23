//jshint esversion:6
const express = require("express");
// const router = express.Router();
const router = express.Router({mergeParams:true});
const Comment = require("../models/comment");
const Movie = require("../models/movie");


// ======== COMMENT ROUTES ARE NESTED - STARTING HERE==========
// 4.b New	    /movies/:id/comments/new
// router.get("/movies/:id/comments/new",isLoggedIn,(req,res)=>{
router.get("/new",isLoggedIn,(req,res)=>{
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

// // 4.c Create	/movies/:id/comments
// router.post("/movies/:id/comments",isLoggedIn,(req,res)=>{
router.post("/",isLoggedIn,(req,res)=>{
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
          insertedComment.author.id = req.user._id;
          insertedComment.author.username = req.user.username;
          insertedComment.save();
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
