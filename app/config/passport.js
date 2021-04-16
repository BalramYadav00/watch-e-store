const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')
const user = require('../models/user')
const lowercase = require('lower-case');

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        // Login
        // Check if email/phone exist
        const _email = (lowercase.lowerCase(email)).trim();
        const user = await User.findOne({ email: _email })
        if(!user)
        return done(null, false, {message: 'Oops! You are not yet registered.'});

        bcrypt.compare(password, user.password).then(match => {
            if(match)
            return done(null, user, {message: 'Logged in successfully.'})
            return done(null, false, {message: 'Wrong email or password!'})
        }).catch(err => {
            return done(null, false, {message: 'Something went wrong!'})
        })


    }))

    passport.serializeUser((user, done) => {
        done(null,user._id)                         //Serializing the ID in session
    })

    passport.deserializeUser((id, done) => {
        user.findById(id, (err, user) => {          //Fething the user by ID
            done(err, user)
        });
    })

}

module.exports = init;