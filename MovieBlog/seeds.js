//jshint esversion:6
const mongoose = require('mongoose');
const Movie = require("./models/movie");
const Comment = require("./models/comment");

const firstMovies = [{
    title: "The Dark Knight Triology",
    image: "https://static.comicvine.com/uploads/original/11123/111232510/4776142-the-dark-knight-trilogy-source.jpg",
    description: "The Dark Knight Trilogy is a British-American superhero film trilogy based on the DC Comics character Batman. The trilogy consists of Batman Begins (2005), The Dark Knight (2008) and The Dark Knight Rises (2012), directed by Christopher Nolan."
  },
  {
    title: "Avengers:Endgame",
    image: "https://specials-images.forbesimg.com/imageserve/5cc0c243a7ea436c70f3ba2f/960x0.jpg",
    description: "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to undo Thanos' actions and restore order to the universe."
  },
  {
    title: "Gotham",
    image: "https://www.log.com.tr/wp-content/uploads/2018/12/Gotham-Season-5-Poster-FOX.jpg",
    description: "The story behind Detective James Gordon's rise to prominence in Gotham City in the years before Batman's arrival."
  },
];

const firstComments = [{
    text: "best series in history of Batman",
    author: "burak"
  },
  {
    text: "can`t imagine Marvel without Ironman ",
    author: "scarlett"
  },
  {
    text: "it reminds me some scenes from Fringe",
    author: "burak"
  }

];

function seedDB() {
  Movie.deleteMany({}, function(err) {
      if (!err) {
        console.log("*** DELETED ALL OF THE MOVIES ***");
        console.log("*** INSERTING DEFAULT MOVIES INITIATED ***");
        Movie.insertMany(firstMovies, function(err, insertedMovies) {
          if (!err) {
            console.log("===== default list of movies insterted successfully =====");
            console.log(insertedMovies[0].title);
            console.log(insertedMovies[1].title);
            console.log(insertedMovies[2].title);
            console.log("===== default list of movies insterted successfully =====");
            Comment.insertMany(firstComments, function(err, insertedComments) {
              if (!err) {
                console.log("===== default list of comments insterted successfully =====");
                for(i=0;i<3;i++){
                  insertedMovies[i].comments.push(insertedComments[i]);
                  insertedMovies[i].save();
                }
                console.log("===== default list of comments added to movies collections successfully =====");
              } else {
                console.log("insertMany error - for comments");
                console.log(err);
              }
            });
          } else {
            console.log("insertMany error - for movies");
            console.log(err);
          }
        });
      }else{
        console.log("deleteMany error");
        console.log(err);
      }
    });
  }

module.exports = seedDB;


//
