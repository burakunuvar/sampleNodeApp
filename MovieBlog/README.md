
* ### Part3 : MODELS


 * #### Step1

// build models folder;
// Update movieSchema with comments , create a separate file as movie.js; including module.exports = Movie
// Create commentSchema, create a seperate file as comment.js ; including module.exports = Comment
// Update app.js by removing Movie movieSchema and requiring new models created above

// views, models and public folder(for styling), will all be in the same directory with app.js
  Those are all alternatives to locate :

```  
$ app.use(express.static("public"));
$ app.use(express.static("./public"));
$ app.use(express.static(__dirname + "/public"))
```

 * #### Step2


// IMPORTANT HINT FOR LOCATIONS :

```

- ` / ` means go back to the root folder, then traverse forward/downward.
- `./ ` means begin in the folder we are currently in (current working directory) and traverse forward/downward in the tree. ( same with using nth or `_dirname` )

- `../` means go up one directory, then begin the traverse.

```

// Build seeds.js ending with `module.exports = seedDB;`

// Code will not run in a queue ( asynch ) ; so use callbacks

// Don't make functions within a loop, [click for details](https://www.youtube.com/watch?v=Nqfs14iu_us)

// display comments by using populate.exec. So update `app.get("/movies/:id",function(req,res){` by replacing

```
Movie.findById(req.params.id,function(err,shownMovie){
  if(!err){
    res.render("show",{shownMovie:shownMovie});
    console.log(shownMovie);
  }else{
    console.log(err);
  }
});

```
 with

```
Movie.findById(req.params.id).populate("comments").exec(function(err,shownMovie){
  if(!err){
    res.render("show",{shownMovie:shownMovie});
    console.log(shownMovie);
  }else{
    console.log(err);
  }
});

```

 * #### Step3

 // Update show.ejs by including comments, which is an array of objects inside movies collection.

 ```
$ <% shownMovie.comments.forEach(function(comment){ %>
$   <h5> <%= comment %></h5>
$   <p>
$       <strong><%= comment["author"] %></strong> - <%=comment.text %>
$       <br>
$     <strong><%= comment.author %></strong> - <%= comment["text"] %>
$   </p>
$ <% }) %>

 ```
