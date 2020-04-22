const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');


module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:'username'}, (username, password,done)=>{
            User.findOne({username:username})
            .then(user => {
                if(!user){
                    return done(null, false,{message:"that user does not exist"});
                }
                bcrypt.compare(password, user.password, (err,isMatch)=> {
                    if(err)throw err;
                    if(isMatch){
                        return done(null,user)
                    }
                    else{
                        return done(null,false,{message: 'password incorrect'})
                    }
                });
            })
        })
    );
    passport.serializeUser(function(user,done){
        done(null, user.id);
    });
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        });
    });
}
