const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema");
const passport = require("passport");
const bcrypt = require("bcrypt");



router.get("/:id", (req, res, next) => {
    var payload = {
        pageTitle: "See Post",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id
    }
    res.status(200).render("post", payload);

})


module.exports = router;



