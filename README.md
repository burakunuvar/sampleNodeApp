## sampleNodeApp - MovieBlog

* ### Part1 : Ignite the Project

 * #### STEP 1 :

 // git init and refer to [Node.gitignore](https://github.com/github/gitignore/blob/master/Node.gitignore#L3)

 // initialize and build package.json

 // Install express and ejs packages

 ```node
  $ npm init
  $ npm i express ejs
 ```

 * #### STEP 2:

 // Build app.js based on boilerplate

 // Build views folder for landing.ejs and movies.ejs

 // use a default array of listOfMovies to be rendered by movies.ejs, until a permanent database is built.

 // Build partials folder for header.ejs(with bootstrap) and footer.ejs

 // Include necessary code at the beginning and end of any rendered page :

 ```ejs
  <%- include('partials/header') -%>
  <%- include('partials/footer'); -%>
 ```

 * #### STEP3 :

 // adapt a post route and install bodyParser

 ```node
 $ npm i body-parser
```
So that req.body.title, req.body.image will be passed through the form

 // Don't miss the line `
  app.use(bodyParser.urlencoded({ extended: true }));`

 // Build a new ejs file for new items to be added : newMovie.ejs

 // Use a form with method="POST" and action="/movies" ;should be same as post route

 ```
  $ <form action="/movies" method="POST">
    <!-- should be same as post route -->
  $   <input type="text" name="title" placeholder="name of the movie">
  $   <input type="text" name="image" placeholder="image URL">
  $   <button type="submit" name="button"> submit </button>
  $ </form>

 ```

 * #### STEP4 :

 // Add Bootstrap link to header.ejs file
 // [fit-100-of-an-image-to-a-jumbotron](https://stackoverflow.com/questions/31147543/how-to-fit-100-of-an-image-to-a-jumbotron)
