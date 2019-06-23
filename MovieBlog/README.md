* ###  <u>  **Part8 : User Associations:Comment

* #### Steps

  => Update the author in comment model to include user data

 ```
 // === FROM THIS : ===

 var commentSchema = new mongoose.Schema({
     text: String,
     author: String
 });

 // === TO THIS : ===
  var commentSchema = new mongoose.Schema({
      text: String,
      author: {
       id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
       username: String,
     }
  });

 ```

 Note1 : It could be just the id inside the commentSchema, but that would require additional queries to receive username ; for which Mongoose provides an easier alternative.

 Note2 : the author will be single due to one to one relationship ( each comment needs to belong to one user ) , thus it's just one object with two items, rather than an array of items in one to many relationships ()

 => Drop database through mongo shell and remove
 seedDB for a manual entry

 => use `req.user` in post comment route within app.js to pass data through after login.

 ```
comment.author.id = req.user._id ;
comment.author.username = req.user.username
comment.save();

 ```

 => Update newComment.ejs not to request username

 => Update showMovie.ejs to show author.username
