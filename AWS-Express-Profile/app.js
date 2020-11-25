
// Package Dependancies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var AWS = require('aws-sdk');
const fileUpload = require('express-fileupload');
var MySql = require('sync-mysql');
require('dotenv').config()

var app = express();
const s3 = new AWS.S3({
  accessKeyId: process.env.awsKeyID,
  secretAccessKey: process.env.awsKey
});
var connection = new MySql({
  host: process.env.databaseHost,
  database: process.env.databaseName,
  user: process.env.databaseUser,
  password: process.env.databasePass
});

// Middleware Setip
app.set('views', path.join(__dirname, 'views')); // view engine setup
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: process.env.SessionSecret})); //session setup
app.use(fileUpload({useTempFiles : false}))

//Page Route Setup done in this file rather then with a router
app.get('/edit', function(req, res, next){
  if(req.session.loggedIn)
    res.render('edit', {title: 'Edit Profile', loggedIn: req.session.loggedIn, connection:connection});
  else
    next(createError(401));
});

app.get('/login', function(req, res, next){
  if(!req.session.loggedIn)
    res.render('login', {title: 'Login', loggedIn: req.session.loggedIn, connection:connection});
  else
    next(createError(401));
});

app.get('/', function(req, res, next){
  res.render('home', {title: 'James Oswald', loggedIn: req.session.loggedIn, connection:connection});
});

//API Route Setup
app.post('/loginEndpoint', function(req, res, next){
  console.log(req.body);
  let err="Error: Unknown Error";
  try{
    if(!req.session.loggedIn){
      if(req.body.username === process.env.username && req.body.password === process.env.password){
        req.session.loggedIn = true;
        err="";
      }else
        err="Wrong Password";
    }
    else
      err="Error: Already Logged In"
  }catch(e){
    err = "Error: " + e;
  }finally{
    res.json({err:err});
  }
});

app.post("/logoutEndpoint",  function(req, res, next){
  let err="Error: Unknown Error";
  try{
    if(req.session.loggedIn){
        req.session.loggedIn = false;
        err="";
    }
    else
      err="Error: Already Logged Out"
  }catch(e){
    err = "Error: " + e;
  }finally{
    res.json({err:err});
  }
});


app.post("/updateEndpoint", function(req, res, next){
  if(!req.session.loggedIn)
    return next(createError(401));
  console.log(req.body);
  if(req.body.username)
    connection.query("UPDATE User SET Name='" + req.body.username + "' WHERE id=1;");
  if(req.body.password)
    connection.query("UPDATE User SET Password='" + req.body.password + "' WHERE id=1;");
  if(req.body.description)
    connection.query("UPDATE User SET Description='" + req.body.description + "' WHERE id=1;");
  if (!req.files || Object.keys(req.files).length === 0)  //S3 File store
    console.log("No Files");
  else{
    const params = {
      Bucket: "aws-express-profile",
      Key: req.files.profile.name, // File name you want to save as in S3
      Body: req.files.profile.data
    };
    s3.upload(params, function(err, data){
      if (err)
        next(createError(400));
      console.log(`File uploaded successfully. ${data.Location}`);
      connection.query("UPDATE User SET Picture='" + data.Location + "' WHERE id=1;");
    });
  }
  return res.redirect("/edit");
});

// Error Handleing
app.use(function(req, res, next){  // catch 404 and forward to error handler
  next(createError(404));
});

app.use(function(err, req, res, next){ // error handler
  res.locals.message = err.message; // set locals, only providing error in development
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500); // render the error page
  res.render('error');
});

//Exports
module.exports = app;
