const express = require('express');
const layout = require('express-ejs-layouts')
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
//db config
const db = require('./config/keys').MongoURI;

//connect to mongo
mongoose.connect(db,{ useNewUrlParser: true , useUnifiedTopology: true })
    .then(console.log("MongoDB connected.................................."))
    .catch(err => console.log(err))
//body parser
app.use(express.urlencoded({extended:false}))

//routes
app.use('/',require("./routes/index"))
app.use('/users',require("./routes/users"))

app.use(layout)
app.set('view engine', 'ejs')


const port = process.env.PORT || 1000;
app.listen(port, console.log(`Server started on port ${port}........................`));