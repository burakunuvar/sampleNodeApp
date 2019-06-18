//jshint esversion:6
const express = require("express");
const ejs = require('ejs');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Movie = require("./models/movie");
const Comment = require("./models/movie");
const seedDB = require("./seeds");

seedDB();
mongoose.connect('mongodb://localhost:27017/moviesDB', {useNewUrlParser: true});

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {
  // console.log(__dirname) ;
  res.render("landing");
});

//RESTAPI: 1-GET; request made to index.ejs
app.get("/movies", (req, res) => {
  console.log("**** RESTAPI: 1-GET; request made to index.ejs ");
  Movie.find({},function(err,foundMovies){
    if(!err){
      res.render("index", {
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
  res.render("newMovie");
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
      res.render("show",{shownMovie:shownMovie});
      console.log(shownMovie);
    }else{
      console.log(err);
    }
  });
});


app.listen(3000, function() {
  console.log("MovieCamp started on port 3000");
});
