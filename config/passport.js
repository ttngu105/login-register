const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const User = ('../models/User');

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
            .catch(err=>console.log(err))
        })
    );
    passport.seralizeUser(function(user,done){
        done(null, user.id);
    });
    passport.seralizeUser(function(id,done){
        User,findById(id,function(err,user){
            done(err,user);
        });
    });
}
