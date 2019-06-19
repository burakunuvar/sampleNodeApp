
* ### Part4 : NESTED ROUTES


 * #### Step1 Build Nested Routes

|   | name              | path                     | HTTP Verb | Mongoose Method          | Purpose                                           |
|---|-------------------|--------------------------|-----------|--------------------------|---------------------------------------------------|
| 1 | INDEX             | /movies                  | GET       | collection.find          | list all movies                                   |
| 2 | NEW               | /movies/newForm          | GET       | N/A                      | display the form for new movie                    |
| 3 | CREATE            | /movies                  | POST      | collection.create()      | insert a new movie                                |
| 4 | SHOW              | /movies/:id              | GET       | collection.findById()    | show details of selected movie                    |
|   | 4.a nested index  | /movies/:id/comments/    | GET       | collection.find()        | list all comments                                 |
|   | 4.b nested new    | /movies/:id/comments/new | GET       | N/A                      | display the form for new comment                  |
|   | 4.c nested create | /movies/:id/comments     | POST      | collection.create()      | insert a new comment                              |
|   | 4.d nested show   | /movies/:id/comments/:id | GET       | collection.findById()    | show details of selected comment                  |
| 5 | EDIT              | /movies/:id/edit         | GET       | post.findById()          | Show edit form for one post                       |
| 6 | UPDATE            | /movies/:id              | PUT       | post.findByIdAndUpdate() | Update particular post, then redirect             |
| 7 | DESTROY           | /movies/:id              | DELETE    | post.findByIdAndRemove() | Delete a particular post, then redirect somewhere |

* #### Step2

//Create seperate folders as movies and comments, for the related ejs files in views folder
  Don't forget to update the route for the partials (footer and header), as the working directory will be updated (in app.js and index.ejs )

// Add the logic for the routes 4b and 4c to the app.js file ; as mentioned on table above

- 4.b For get route use populate for the associated schemas :
  ```
Movie.findById(req.params.id).populate("comments").exec(function(err,whichMovietoComment){
  ```

- 4.c For post route, go step by step
 -  create a new comment
 - look up campground using ID
 - connect new comment to movie
 - redirect to showpage

// build newComment.ejs ; for the id: part you'll need another rendering on app.js (similar to edit, on RESTFUL APIs)

// [Express-Sanitizer](https://www.npmjs.com/package/express-sanitizer) is recommended to prevent cross site scripting

Sample :

 ```
$ npm i express-sanitizer
$ const expressSanitizer = require('express-sanitizer');
$ app.use(expressSanitizer());
$ req.body.comment.text = req.sanitize(req.body.comment.text);
```
