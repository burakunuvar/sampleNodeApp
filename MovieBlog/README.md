
* ###  <u>  **Part5 : Adding Authentication  ** </u>

* #### Step 1

  => Install and require the modules

   ```
$ npm i passport passport-local passport-local-mongoose express-session
  ```

    => Require the necessary modules in app.js :

    ```
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
    ```
    optional (whether you're using createStrategy in passportLocalMongoose or not):
    ```
    LocalStrategy = require (passport-local);
    passport.use(new LocalStrategy(User.authenticate()));

    or go straight with the new approach

    passport.use(User.createStrategy());

    ```
    => Build a userSchema in models folder and require in app.js  :

    ```
const mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User",userSchema);
userSchema.plugin(passportLocalMongoose);
module.exports = User ;
```



* #### Step 2

  => Setup express-session

  Note : Queue of the syntax is important; express-session should be called by below syntax, before DB session is established and after other app.use functions :


  ```
  app.use(session({
    secret: 'moviesDB-buraku',
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
  }));

  or

    app.use(require("express-session")( {
    secret :" used to encrypt and decrypt " ,
    resave : false ,
    saveUninitialized : false
}));


```
  => Setup passport  :

 ```
    app.use(passport.initialize());
    app.use(passport.session());
```

  => Integrate passportLocalMongoose to User Model

  ```
const passportLocalMongoose = require('passport-local-mongoose');
userSchema.plugin(passportLocalMongoose);
  ```

  This will hash and salt the passwords before saving to database; and does a lot of heavy lifting for us!

  ```
  // Enable authentication; in the new approach USE "createStrategy" INSTEAD OF "authenticate"
  passport.use(User.createStrategy());

  // Use static serialize and deserialize of model for passport session support
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  ```

* #### Step 3

 => Add auth ( register and login ) routes to app.js

 <u>  register route :

 ```  
 app.get("/register", function(req, res) {
   res.render("register");
 });

 app.post("/register", function(req, res) {
   const newUser= new User({
     username: req.body.username
   });
   User.register(newUser, req.body.password, function(err, user) {
     if (err) {
       console.log(err);
       res.redirect("/register");
     }else{
       passport.authenticate('local')(req, res, function() {
         res.redirect('/secret');
       });
     }
   });
 });

 ```
 <u> login route :

 ```  
 app.get("/login", function(req, res) {
  res.render("login");
}); {}

 app.post("/login", passport.authenticate("local", {
    successRedirect: "/movies",
    failureRedirect: "/login"
}) ,function(req, res){
});

 ```
<u>  logout route :

 => Build register.ejs  and login.ejs in views folder

 ```  
 app.get("/logout", function(req, res){
     req.logout();
     res.redirect("/");
 });

 ```


 * #### Step 4

 => Make necessary updates on navbar for login, register and logout links

 => Add header and footer to login and register forms. ( be careful about directory )

 => If not logged in, don't allow to add comment, by using middleware :

 ```  
 function isLoggedIn(req, res, next){
     if(req.isAuthenticated()){
       return next();
     }else{
       res.redirect("/login")
     }
 }

 ```
 => Add the middleware to comment routes ( new and post )

 => If not logged in, don't allow to add comment, by using middleware :


  => Show/hide auth links in navbar correctly ; by passing through `req.user` from app.js to header.ejs and adding if $ else statement

  Hint : easier way to pass user data to all ejs files, instead of adding one by one :

  ```  
  app.use(function(req,res,next){
    res.locals.currentUser = req.user ;
    next();
  });
  ```

  ```
  <%  if(!currentUser) { %>
      <li class="nav-item"> <a class="nav-link" href="/login">Login</a> </li>
      <li class="nav-item"> <a class="nav-link" href="/register">Sign Up</a> </li>
 <% } else { %>
    <li class="nav-item"> <a class="nav-link" href="#"> signed in as  <%= currentUser.username %> </a> </li>
    <li class="nav-item"> <a class="nav-link" href="/logout">Logout</a> </li>
 <% } %>
  ```

  [next() vs return(next)](https://stackoverflow.com/questions/16810449/when-to-use-next-and-return-next-in-node-js)

   => If logged in ; show "currently signed in as `req.user.username` = `currentuser.username`"
