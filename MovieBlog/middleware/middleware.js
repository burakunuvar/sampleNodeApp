
var Movie = require("../models/movie.js") ;
var Comment = require("../models/comment.js") ;
var middlewareObj= {} ;

middlewareObj.isLoggedIn = function (req, res, next){
  if(req.isAuthenticated()){
    console.log("MIDDLEWARE RUNNING SUCCESSFULLY, NEXT");
    return next();
  }else{
    console.log("MIDDLEWARE FAILED");
    res.redirect("/login");
  }
};

middlewareObj.checkCommentAuthorization = function (req, res, next){
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
};


middlewareObj.checkMovieAuthorization = function (req, res, next){
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
};

module.exports = middlewareObj;
