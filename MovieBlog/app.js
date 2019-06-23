//jshint esversion:6
const express = require("express");
const ejs = require('ejs');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// const Movie = require("./models/movie");
// const Comment = require("./models/comment");
const User = require("./models/user");
const seedDB = require("./seeds");
const expressSanitizer = require('express-sanitizer');
const session = require('express-session');
const passport = require("passport");
// const LocalStrategy  = require("passport-local");
const passportLocalMongoose = require('passport-local-mongoose');
const commentRoutes = require("./routes/comments");
const movieRoutes = require("./routes/movies");
const authRoutes = require("./routes/auths");

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

// app.use(commentRoutes);
// app.use(movieRoutes);
// app.use(authRoutes);

app.use("/", authRoutes);
app.use("/movies", movieRoutes);
app.use("/movies/:id/comments", commentRoutes);

app.listen(3000, function() {
  console.log("MovieCamp started on port 3000");
});
