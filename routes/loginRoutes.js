const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema");
const passport = require("passport");


const bcrypt = require("bcrypt");
app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false}));

router.get("/", (req, res, next) => {
    res.status(200).render("login");

})

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get("/home", passport.authenticate('google'), (req, res, next) => {
    res.redirect('/profile/');
    

})





router.post("/", async(req, res, next) => {

    var payload = req.body;

    if(req.body.username && req.body.password){
        var user = await User.findOne({
            $or: [
                { username: req.body.username},
                {email: req.body.password}

            ]

        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong";
            res.status(200).render("login", payload);
        });

        if(user != null) {
            var result = bcrypt.compare(req.body.password, user.password)
            if(result == true) {
                req.session.user = user;
                return res.redirect("/");
                
            }
            

        }

        payload.errorMessage = "Login credentials incorrect";
        return res.status(200).render("login", payload);


    }
    payload.errorMessage = "Make sure each entry is valid";
    res.status(200).render("login");

})

module.exports = router;


