const passport = require('passport');
const GoogleStrategy = require('passport-google-oath');
const keys = require('./keys');
const User = require("../schemas/UserSchema");

passport.serializeUser((user,done) => {
    done(null, user.id)
})

passport.deserializeUser((user,done) => {
    User.findById(id).then((user) => {
        done(null, user.id);

    })
    
})

passport.use(new GoogleStrategy({
    callbackURL: '/google',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
    
}, (accessToken, refreshToken, profile, done) => {
    User.findOne({googleId: profile.id}).then((currentUser) => {
        if(currentUser){
            console.log(currentUser);
            done(null, currentUser);

        }

    })
    
    new User({
        fullname: profile.displayName,
        googleId: profile.id
    }).save().then((newUser) => {
        console.log('new user created');
        done(null, newUser);
    });
})

)