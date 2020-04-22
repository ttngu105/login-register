const express = require('express');
const layout = require('express-ejs-layouts');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require("./config/passport")(passport);
const cors = require('cors');

//db config
const url = require('./config/keys').MongoURI;
//use cors
app.use(cors());

//connect to mongoDB
mongoose.connect(url,{ useNewUrlParser: true , useUnifiedTopology: true })
//try to see if im an connected the database
mongoose.connection.on('connected', function(){console.log("MongoDB connected..................................")});
mongoose.connection.on('error', function(){console.log('i am not connected')});
mongoose.connection.on('disconnected', function(){console.log('i have disconnected')});
//body parser
app.use(express.urlencoded({extended:false}))
//Express session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));
//passport
app.use(passport.initialize());
app.use(passport.session());
//add route to langing page
app.get('/homepage',(request,response)=>{
    response.status(301).redirect('https://ttngu105.github.io/landing-page/')
});
// flash
app.use(flash());
//global variables
app.use((request,response,next)=>{
    response.locals.success_msg = request.flash('success_msg');
    response.locals.error_msg = request.flash('error_msg');
    response.locals.error = request.flash('error');
    next();
});

//routes
app.use('/',require("./routes/index"))
app.use('/users',require("./routes/users"))

app.use(layout)
app.set('view engine', 'ejs')

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server started on port ${port}........................`));

function localhostHandler(request,response,next){
	response.header('Access-Control-Allow-Origin','*');
	response.header('Access-Control-Allow-Methods','POST')
	next();
}