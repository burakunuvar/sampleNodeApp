//jshint esversion:6
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/", (req, res) => {
  // console.log(__dirname) ;
  res.render("landing");
});


// ======== AUTH ROUTES START HERE  ==========

//REGISTER
router.get("/register", function(req, res) {
 res.render("register");
});

router.post("/register", function(req, res) {
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


router.get("/login",function(req,res){
    console.log("request to login/ ") ;
    res.render("login");
});

// router.post("/login", passport.authenticate("local", {
//         successRedirect: "/movies",
//         failureRedirect: "/login"
//     }) ,function(req, res){
// });

router.post("/login", function(req, res) {
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

router.get("/logout", function(req, res){
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

module.exports = router ;
