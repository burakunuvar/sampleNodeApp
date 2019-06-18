
//will run only once, when the app started for the first time
const listOfMovies = [{
    title: "The Dark Knight Triology",
    image: "https://static.comicvine.com/uploads/original/11123/111232510/4776142-the-dark-knight-trilogy-source.jpg",
    description: "The Dark Knight Trilogy is a British-American superhero film trilogy based on the DC Comics character Batman. The trilogy consists of Batman Begins (2005), The Dark Knight (2008) and The Dark Knight Rises (2012), directed by Christopher Nolan."
  },
  {
    title: "Avengers:Endgame",
    image: "https://specials-images.forbesimg.com/imageserve/5cc0c243a7ea436c70f3ba2f/960x0.jpg",
    description:"After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to undo Thanos' actions and restore order to the universe."
  },
  {
    title: "Gotham",
    image: "https://www.log.com.tr/wp-content/uploads/2018/12/Gotham-Season-5-Poster-FOX.jpg",
    description:"The story behind Detective James Gordon's rise to prominence in Gotham City in the years before Batman's arrival."
  },
];
Movie.insertMany(listOfMovies, function(err, insertedMovies) {
  if(!err){
    console.log("Default Movies inserted successfully");
  }else{
    console.log(err);
  }
});

listOfMovies.push(newMovie); // in initial post route
