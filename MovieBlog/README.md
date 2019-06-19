* ### Part5 : Public Folder for Styling with CSS and JS

// Style showOneMovie.ejs by using Bootstrap4

// Build public folder, in the same directory with app.js, to include specific CSS and JS files

  Those are all alternatives to use  :

  ```
$ app.use(express.static("public"));
$ app.use(express.static("./public"));
$ app.use(express.static(__dirname + "/public"));
  ```

In case of any issues, [this stackoverflow link](https://stackoverflow.com/questions/48248832/stylesheet-not-loaded-because-of-mime-type) might help


// You can now move the style tag for backgroundpicture inside header.ejs to main.css as well

// You will also have to add new resource to header.ejs , after bootstrap such as `<link rel="stylesheet" href="/stylesheets/main.css">``
