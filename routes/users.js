const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require('../models/User');
const passport = require('passport');


router.get("/login",(request,response)=> response.render("login"));

router.get("/register",(request,response)=> response.render("register"));

router.post("/register",(request,response)=>{
    const {email,username, password, password2} = request.body;
    let errors = [];
    //error message handler
    if(!email || !username || !password || !password2){
        errors.push({msg:"please fill in all fields"});
    }
    if(password !== password2){
        errors.push({msg:"passwords do not match"});
    }
    if(password.length < 6){
        errors.push({msg:"password should at least be 6 characters"})
    }
    if(errors.length > 0){
        response.render("register",{email,username,errors})

    }    
    else{
        //passed valiadation
        User.findOne({username:username},function(error,user){

                if (user) {
                  if(user['email'] == email){
                    errors.push({ msg: 'Email already exists' });
                    response.render('register', {
                      errors,
                      username,
                      email,
                      password
                    });
                  }
                  else if (user['username'] == username ){
                    errors.push({ msg: 'Username already exists' });
                    response.render('register', {
                      errors,
                      username,
                      email,
                      password
                    });
                  }
                } 
                  else {                
                    const newUser = new User({
                      username,
                      email,
                      password
                    });
                    //hash password
                    bcrypt.genSalt(10,(err,salt)=>
                    bcrypt.hash(newUser.password,salt, (err,hash) => {
                    if(err){ throw err};
                    newUser.password = hash;
                    newUser.save()
                      .then(user => {
                        try{
                          User.create(newUser)}
                          catch(error){console.log(error)}
                        request.flash('success_msg','You are now registered !!') 
                        response.redirect('login')
                      })
                      .catch(err => console.log(err));
                    }));
                }
               
            })
    }

});
//login handler
router.post('/login',(request,response,next)=>{
  passport.authenticate('local',{
    successRedirect:'/homepage',
    failureRedirect: '/users/login',
    failureFlash: true
  })(request,response,next);
})

module.exports = router;