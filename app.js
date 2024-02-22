const express = require("express");
const app = express();
const middleware = require("./middleware");
const path = require("path");
const mongoose = require("./database");
const bodyParser = require("body-parser");
const session = require("express-session"); 
const passport = require('passport');
const passportSetup = require('.config/passport-setup');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');



const server = app.listen(3003, (req, res) => {
    console.log("Joined!!");
})
// set up view engine
app.set("view engine", "pug");
app.set("views", "views");

//  set up routes 
app.use(cookieSession({
    maxAge: 24 * 60 & 60 *1000,
    keys: [keys.session.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: "bits pilani",
    resave: true,
    saveUninitialized: false,
    
}))

// Routes
const loginRoute = require("./routes/loginRoutes.js");
const logoutRoute = require("./routes/logoutRoutes.js");
const registerRoute = require("./routes/registerRoutes.js");
const postRoute = require("./routes/postRoutes");

// api routes
const postsAPIRoute = require("./routes/api/posts");


app.use("/auth", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);
app.use("/posts", middleware.requireLogin, postRoute);
app.use("/api/posts", postsAPIRoute);


app.get("/", middleware.requireLogin, (req, res, next) => {
    
    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),


    }

    res.status(200).render("home", payload);

})


