//jshint esversion:6
const express = require("express");
const ejs = require('ejs');
const bodyParser = require("body-parser");

const listOfMovies = [{
    title: "The Dark Knight Triology",
    image: "https://static.comicvine.com/uploads/original/11123/111232510/4776142-the-dark-knight-trilogy-source.jpg"
  },
  {
    title: "Avengers:Endame",
    image: "https://specials-images.forbesimg.com/imageserve/5cc0c243a7ea436c70f3ba2f/960x0.jpg"
  },
  {
    title: "Gotham",
    image: "https://www.log.com.tr/wp-content/uploads/2018/12/Gotham-Season-5-Poster-FOX.jpg",
  },
];
const app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {
  // console.log(__dirname) ;
  res.render("landing");
});

app.get("/movies", (req, res) => {
  res.render("movies", {
    renderedMovies: listOfMovies
  });
});

app.post("/movies", (req, res) => {
  var newMovie={
    title: req.body.title,
    image: req.body.image,
  };
  listOfMovies.push(newMovie);
  res.redirect("/movies");
});

app.get("/movies/newMovie", (req, res) => {
  res.render("newMovie");
});

app.listen(3000, function() {
  console.log("MovieCamp started on port 3000");
});
