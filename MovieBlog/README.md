* ###  <u>  **Part9: User Associations: Movie

* #### Step1 : Only authenticated user can add a new movie

  => Use isLoggedIn middleware to render newComment and post one.

* #### Step2 : Username + id should be associated with the movie

  => Update movie.js model to include user data in movieSchema :

  ```
 author: {
  id:  {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User"
 },
  username: String,
 }

 ```

 Note1 : It could be just the id inside the movieSchema, but that would require additional queries to receive username ; for which Mongoose provides an easier alternative.

 Note2 : the author will be single due to one to one relationship ( each movie needs to belong to one user ) , thus it's just one object with two items, rather than an array of items in one to many relationships (such as movies and comments)


  => Update posting a new movie route with the new schema :
  => use `req.user` in post movie route within app.js to pass data through after login.

```  
// add this part as opt1
var newMovie={
  title: req.body.title,
  image: req.body.image,
  description: req.body.description,
  author: {
    id: req.user._id,
    username: req.user.username,
  },
};
```

```
// Or add this part as opt2

newMovie.author.id = req.user._id;
newMovie.author.username = req.user.username;

```

 => Drop database through mongo shell and remove seedDB for a manual entry

 => Update showMovie.ejs to show author.username , as submitted by ...
