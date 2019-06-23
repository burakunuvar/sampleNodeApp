* ###  <u>  **Part6 : Refactoring Routes

* #### Steps

  => make a new directory called "routes" in the same folder as app.js; that will include 3 main route files :

 ```
  $ mkdir routes
  $ touch routes/movies.js
  $ touch routes/comments.js
  $ touch routes/auths.js
```
 =>Copy and past the related logic to each of the created files

 => Require express and use router in each of files , to return a value :

 ```
  const express = require("express");
  const router = express.Router();
  ...
  module.exports = router
```
// replace all `app.` with `router.`

 => Require the created routes in app.js and call each :

 ```
  const commentRoutes = require("./routes/comments");
  const movieRoutes = require("./routes/movies");  
  const authRoutes = require("./routes/auth");
  app.use(commentRoutes);
  app.use(movieRoutes);
  app.use(authRoutes);
```
=> Work on warnings on each of created route files, eliminate them by requiring needed dependencies

 => Optional:  Place the routes in app.use functions and remove from created routes ...

 ```
  app.use("/", authRoutes);
  app.use("/movies", movieRoutes);
  app.use("/movies/:id/comments", commentRoutes);
```
 => to be able to use ":id" you should merge params in the file it's included ( comment.js, in this case)
 ```
 const router = express.Router({mergeParams:true});
 ```
