
* ### Part2 : DATA PERSISTANCE

 * #### STEP1 :

  // create new branch

  ```
  $ npm install mongoose
  ```

  // Update app.js with required code based on [Mongoose](https://mongoosejs.com/)

  // Build movieSchema : new mongoose.Schema is needed for complex scripts, whereas a JS Object is only for basic commands.

  ```
  $ const movieSchema = new mongoose.Schema({
  $   title: String,
  $   image: String,
  $   description: String,
  $ });

  & const Movie = mongoose.model('Movie', movieSchema);

  ```

  STEP2 :
  // Migrate the default array of listOfMovies to the database by ` collection.insertMany` model at the [link](https://mongoosejs.com/docs/api/model.html#model_Model.insertMany). Do this only once, as this will save the array to database permanently.

  // Use db.collections.drop() and insert new items ; and then remove the default array of listOfMovies

  // Update schema and add the 3rd key of the documents as "description" ; update newMovie.ejs and index.ejs files for the new key

  // Update app.get("/movies") with `collection.find({},function(err,found){})` at the [link](https://mongoosejs.com/docs/api/model.html#model_Model.find)

  // Update app.post("/movies") with `collection.create(document,function(err,insertedDoc){)` at the [link](https://mongoosejs.com/docs/api/model.html#model_Model.create)


  STEP 3:

  // RESTFUL ROUTES

  | name   | url             | verb | desc                            |
  |--------|-----------------|------|---------------------------------|
  | INDEX  | /movies         | GET  | find all and display the list   |
  | NEW    | /movies/newMovie| GET  | display the form                |
  | CREATE | /movies         | POST | inserted a new one              |
  | SHOW   | /movies/:id     | GET  | show details of a specific item |


  // Build the show route app.get("/movies/:id") with  `collection.findById` at the link](https://mongoosejs.com/docs/api/model.html#model_Model.findById)

  // use `req.params.id` for `_id` of the object; which is passed data through index.ejs to app.js.

  //Create show.ejs file for the rendered movie
