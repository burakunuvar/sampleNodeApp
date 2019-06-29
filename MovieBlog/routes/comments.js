//jshint esversion:6
const express = require("express");
// const router = express.Router();
const router = express.Router({mergeParams:true});
const Comment = require("../models/comment");
const Movie = require("../models/movie");
const middleware = require("../middleware/middleware");


// ======== COMMENT ROUTES ARE NESTED - STARTING HERE==========
// 4.1 Index	   /movies/:id/comments : not needed for this app
// 4.2 New	    /movies/:id/comments/new
// router.get("/movies/:id/comments/new",isLoggedIn,(req,res)=>{
router.get("/new",isLoggedIn,(req,res)=>{
  console.log("**** Nested RESTAPI: 4.2 GET request made to newCommentForm ");
  Movie.findById(req.params.id).populate("comments").exec(function(err,whichMovietoComment){
    if(!err){
      res.render("./comments/newComment",{whichMovietoComment:whichMovietoComment});
      // console.log(shownMovie);
    }else{
      console.log(err);
    }
  });
});

// // 4.3 Create	/movies/:id/comments
// router.post("/movies/:id/comments",isLoggedIn,(req,res)=>{
router.post("/",isLoggedIn,(req,res)=>{
  console.log("**** Nested RESTAPI: 4.3 POST request made to /movies/:id/comments through newCommentForm ");
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
// 4.4 Show	   /movies/:id/comments/:comment_id : not needed for this app

// 4.5 Edit   /movies/:id/comments/:comment_id /edit
router.get("/:comment_id/edit",checkCommentAuthorization,(req,res)=>{
  console.log("**** Nested RESTAPI: 4.5 POST request made to /movies/:id/comments/:comment_id/edit to render editCommentForm ");
  Comment.findById(req.params.comment_id, function(err,editedComment){
    if(!err){
      res.render("comments/editComment",{editedComment:editedComment,shownMovieId: req.params.id});
      console.log(editedComment);
    }else{
      console.log(err);
    }
  });
});

// 4.6 Update  /movies/:id/comments/:comment_id /edit
router.put("/:comment_id",checkCommentAuthorization,(req,res)=>{
  console.log("**** Nested RESTAPI: 4.6 PUT request made to /movies/:id/comments/:comment_id through editCommentForm ");
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.editedComment,function(err,updatedComment){
    if(!err){
      console.log(updatedComment);
      res.redirect("/movies/" + req.params.id );
    }else {
      res.redirect("back");
    }
  });
});

// 4.7 Destroy  /movies/:id/comments/:comment_id /edit
router.delete("/:comment_id",checkCommentAuthorization,(req,res)=>{
  console.log("**** Nested RESTAPI: 4.7 DELETE request made to /movies/:id/comments/:comment_id through showMovies");
  Comment.findByIdAndRemove(req.params.comment_id,function(err,deletedMovie){
    if(!err){
      console.log(deletedMovie);
      res.redirect("/movies/" + req.params.id );
    }else {
      res.redirect("back");
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

function checkCommentAuthorization(req, res, next){
    if(req.isAuthenticated()){
        console.log("*****AUTHENTICATED*****");
        Comment.findById(req.params.comment_id, function (err, foundComment){
            if(err) {
                console.log("COMMENT NOT FOUND");
                res.redirect("back");
            }else {
                console.log("COMMENT FOUND");
                if(foundComment.author.id.equals(req.user._id)){
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
