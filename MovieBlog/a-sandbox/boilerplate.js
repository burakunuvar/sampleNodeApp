//jshint esversion:6
const express = require("express");
const ejs = require('ejs');
const bodyParser = require("body-parser");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true //to read property 'substring' of undefined
}));

app.get("/", (req, res) => {
  // name of homepage, in views folder
  res.render("index");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
