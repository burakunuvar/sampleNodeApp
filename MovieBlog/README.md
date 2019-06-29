 ###  <u>  ** Part10A: Complete RESTful APIs **

* #### Step1 : method-override

  => HTML forms do not support PUT and DELETE requests; for which you will need [method-override](https://www.npmjs.com/package/method-override):
  ```
  $ npm i method-override
  ```
  ```
  var methodOverride = require('method-override')
  app.use(methodOverride('_method'))
  ```

* #### Step2 : Work on edit route in movies.js

  ```

  router.get("/:id/edit",function(req,res){
    console.log("**** RESTAPI: 5-EDIT ; request made to editMovie.ejs ");
    Movie.findById(req.params.id).populate("comments").exec(function(err,editedMovie){
      if(!err){
        res.render("movies/editMovie",{editedMovie:editedMovie});
        console.log(editedMovie);
      }else{
        console.log(err);
      }
    });
  });

  ```

  => Add a link to shownMovie.ejs for edit route (editMovie.ejs)

  => Build editMovie.ejs, which will be similar to newMovie.ejs except for post(put) route and values


* #### Step3 : Work on update route in movies.js

  => alternative 1 :

  ```
  router.put("/:id",function(req,res){
    console.log("**** RESTAPI: 6-PUT ; request made to showMovie.ejs ");
    var updatedMovie={
      title: req.body.title,
      image: req.body.image,
      description: req.body.description,
      author: {
        id: req.user._id,
        username: req.user.username,
      },
    };
    updatedMovie.author.id = req.user._id;
    updatedMovie.author.username = req.user.username;
    Movie.findByIdAndUpdate(req.params.id,updatedMovie,function(err,updatedMovie){
      if(!err){
        console.log(updatedMovie);
        res.redirect("/movies/");
      }else {
        res.redirect("/posts");
      }
    });
  });

  ```

  => shorter version : Use an object for the values in editMovie

    ```
    name="title" ==> name="editedMovie[title]"
    name="image" ==> "editedMovie[image]"
    name="description" ==> "editedMovie[description]"

    ```

    ```
    router.put("/:id",function(req,res){
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
    ```

* #### Step4 : Work on delete route in movies.js

  => Add the delete route to app.js

  ```
  router.delete("/:id",function(req,res){
    console.log("**** RESTAPI: 7-DELETE ; request made to showMovie.ejs ");
    Movie.findByIdAndRemove(req.params.id,function(err,deletedPost){
      if(!err){
        res.redirect("/movies");
      }else{
        console.log(err);
      }
    });
  });
  ```

  => Add a form with post request to shownMovie.ejs for the delete route

  => Make the form in-line by using id, as it's a block level element and update stylescss file.

  ```
  <form class="form-inline mb-2 " action="/movies/<%=shownMovie._id%>?_method=DELETE" method="POST">
     <a class="btn btn-outline-warning btn-sm d-inline ml-1" href="/movies/<%=shownMovie._id %>/edit" role="button"> edit </a>
     <button type="submit" class="btn btn-outline-danger btn-sm ml-1">delete</button>
   </form>

  ```

  * #### Step5 : Authorization

  => You can't edit, post or delete unless you own the campground

  ```
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
  ```

  => Update show.ejs , for edit and delete links to be visible only for authorized users

    ```
    <%  if(currentUser && shownMovie.author.id.equals(currentUser._id)) { %>
    ```

###  <u>  ** Part10B: Complete RESTful APIs - Nested Routes **

* #### Step1 : Work on edit route

  => Build editComment.ejs by using values instead of placeholders and updating links

  => Add edit button to showMovie.ejs, for editComment.ejs. It will be at the end of each loop for rendering comments.
  Comments are array of objects within Movies, we're rendering one by one; and adding a link at the end of each loop.

  ```
  <form class="form-inline mb-2" action="/movies/<%=shownMovie._id%>/comments/<%=comment._id%>?_method=DELETE" method="POST">
     <a class="btn btn-outline-warning btn-sm d-inline ml-1" href="/movies/<%=shownMovie._id %>/comments/<%=comment._id %>" role="button"> edit </a>
     <button type="submit" class="btn btn-outline-danger btn-sm ml-1">delete</button>
  </form>

  ```

  => Add edit route for comments

  ```
  router.get("/:comment_id/edit",(req,res)=>{
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

  ```
  `shownMovieId: req.params.id});` is in deed already on the url and needed to passed over again for the link to work properly.

* #### Step2 : Work on update route

  => Add Update route

  => Add a form for POST Request to editComment.ejs

  Again, `shownMovieId: req.params.id});` in edit route is in deed already on the url and needed to passed over again for the link to work properly.

  ```
  router.put("/:comment_id",(req,res)=>{
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
  ```

* #### Step3 : Work on delete route

  => Add delete Route

  ```
  router.delete("/:comment_id",(req,res)=>{
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

  ```

  => Add a form for POST Request to showMovie.ejs ( similar to edit )

  ```
  <form class="form-inline mb-2" action="/movies/<%=shownMovie._id%>/comments/<%=comment._id%>?_method=DELETE" method="POST">
  ```

  * #### Step4 : Authorization

  => You can't edit, post or delete unless you own the comment

  ```
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
    ```

  => Update show.ejs , for edit and delete links to be visible only for authorized users

  ```
  <%  if(currentUser && comment.author.id.equals(currentUser._id)) { %>
  ```
###  <u>  ** Part10C: Build middleware for authenticaton and authorization **

  => Build a middleware folder in the same directory with app.js
  => Create an index.js file within this folder with the related functions

  ```
var divesite = require("../models/divesite.js") ;
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
  }

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
  }

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
  }

  module.exports = middlewareObj;

  ```

  => Require the middware.js file in comments and movies ( where it will be called)

  ```
const middware = require("../middleware/middleware");
  ```

  => Require movie and comment model in middleware.js
