//jshint esversion:6
const express = require("express");
const ejs = require('ejs');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Movie = require("./models/movie");
const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seeds");
const expressSanitizer = require('express-sanitizer');
const session = require('express-session');
const passport = require("passport");
// const LocalStrategy  = require("passport-local");
const passportLocalMongoose = require('passport-local-mongoose');

seedDB();
mongoose.connect('mongodb://localhost:27017/moviesDB', {useNewUrlParser: true});

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(expressSanitizer());

app.use(session({
  secret: 'moviesDB-buraku',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
// passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
 res.locals.currentUser = req.user ;
 next();
});

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
app.get("/movies/:id/comments/new",isLoggedIn,(req,res)=>{
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
app.post("/movies/:id/comments",isLoggedIn,(req,res)=>{
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

// ======== AUTH ROUTES START HERE  ==========

//REGISTER
app.get("/register", function(req, res) {
 res.render("register");
});

app.post("/register", function(req, res) {
 const newUser= new User({
   username: req.body.username
 });
 User.register(newUser, req.body.password, function(err, user) {
   if (err) {
     console.log(err);
     res.redirect("/register");
   }else{
     passport.authenticate('local')(req, res, function() {
       res.redirect('/movies');
     });
   }
 });
});

//LOGIN


app.get("/login",function(req,res){
    console.log("request to login/ ") ;
    res.render("login");
});

// app.post("/login", passport.authenticate("local", {
//         successRedirect: "/movies",
//         failureRedirect: "/login"
//     }) ,function(req, res){
// });

app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.passport
  });
  req.login(user, function(err) {
    if (err) {
      console.log(err);
      console.log("LOGIN FAILED");
    }else{
      passport.authenticate('local')(req, res, function() {
        console.log("LOGIN SUCCESS");
        res.redirect('/movies');
      });
    }
  });
});

//LOGOUT

app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

// ======== AUTH ROUTES END HERE ==========

// middleware function for authenticaton check
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    console.log("MIDDLEWARE RUNNING SUCCESSFULLY, NEXT");
    return next();
  }else{
    console.log("MIDDLEWARE FAILED");
    res.redirect("/login");
  }
}


app.listen(3000, function() {
  console.log("MovieCamp started on port 3000");
});
