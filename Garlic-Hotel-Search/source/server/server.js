
"use strict";

let process = require('process');
process.chdir(__dirname);

//================= Lib Imports ========================================================================================

const express = require("express");
const session = require("express-session");
const HotelAPI = require("./API");
const DatabaseInterface = require("./database");
const path = require('path');
const mysql = require("sync-mysql");   
const databaseCreds = require("./databaseCredentials.json");    //Database Username, Password, and Host
let database = new mysql(databaseCreds);
const bcrypt = require("bcrypt");        

//================= Express and Routing Setip ==========================================================================

let app = express(); //initilize the express app
const SESSION_LIFETIME = 1000 * 60 * 60 * 2 // 2 hours

//Routing Setup
app.use(express.static("../client/")); //use default static routing for anything not specified
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: "GarlicEpicSecretCode",
    cookie: {
        maxAge: SESSION_LIFETIME,
        sameSite: true,
        secure: false
    }
})); //set up sessions with a unique secret for ID generation

// set views
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'pug');

//use index.html as our homepage, send it when "root page" is requested
app.get("/", function (req, res) {
  console.log(req.session)
  res.render("index.pug", {
      user: req.session.user
  })
});

// Login/Register page
app.get("/loginregister", function (req, res) {
    if(req.session.user){
        res.redirect("/");
    }else{
        res.render("loginregister.pug", {
            user: req.session.user
        });
    }
});

// Settings Page
app.get("/settings", function (req, res) {
    if(req.session.user){
        res.render("settings.pug", {
            user: req.session.user,
            favs: DatabaseInterface.getFavs(req.session.user)
        })
    }else{
        res.redirect("/")
    }
});

app.get("/logout", function (req, res) {
    if(req.session.user){
        req.session.user = null;
    }
    res.redirect("/")
});

//================== Endpoint Handlers ===================================================================================

//Handle search requests
app.get("/GarlicSearchEndpoint", function (req, res) {
  let searchText = decodeURI(req.query.search);
  let dateRange = decodeURI(req.query.dates);
  let beds = decodeURI(req.query.beds);
  console.log("Recived Request to search for " + searchText + " " + dateRange + " " + beds);
  HotelAPI.search(searchText, dateRange, beds, res); //Call our hotel search interface in API.js
});

//Account Creation Handling
app.get("/GarlicAccountCreationEndpoint", function(req, res){
    console.log("User Creation Query");
    console.log(req.query);
    if(!req.session || !req.session.user){  //If there is no session or session has no associated user
        let newUserReturnObject = DatabaseInterface.newUser(req.query);
        if(newUserReturnObject.errors.length == 0)  //If there were no user creation errors
            req.session.user = newUserReturnObject.user;
        return res.json(newUserReturnObject.makeClientSafe());
    }
    return res.json(new DatabaseInterface.UserRes(null, ["Can not create an account while having an active user session"]));
});

//Login / Authentication Handling
app.get("/GarlicAuthEndpoint", function(req, res){ 
    console.log("User Login Query");
    console.log(req.query);
    if(!req.session || !req.session.user){  //If there is no session or session has no associated user
        let newUserReturnObject = DatabaseInterface.authenticate(req.query);
        if(newUserReturnObject.errors.length == 0)  //If there were no user creation errors
            req.session.user = newUserReturnObject.user;
        return res.json(newUserReturnObject.makeClientSafe());
    }
    return res.json(new DatabaseInterface.UserRes(null, ["Can not login to an account while already logged in"]));
});

//Update Handling
app.get("/GarlicUpdateUserEndpoint", function(req, res){ 
    console.log("User Update Query");
    console.log(req.query);
    database.query(`UPDATE users SET email='${req.query.email}', phone='${req.query.phone}' WHERE user=?`, [req.session.user.username]);
    req.session.user.phone = req.query.phone;
    req.session.user.email = req.query.email;
    res.redirect("/settings")
});

app.get("/GarlicUpdateUserEndpointPw", function(req, res){ 
    console.log("User Update Query");
    console.log(req.query);
    var pw = req.query.pw;
    var pwCheck = req.query.pwCheck;
    if(pw == pwCheck)
    {
        var hash = bcrypt.hashSync(pw, Number(10));
        database.query(`UPDATE users SET pw='${hash}' WHERE user=?`, [req.session.user.username]);
        res.redirect("/settings?changepassword=success")
    }else{
        res.redirect("/settings?changepassword=passwords%dont%match")
    }
});

app.get("/GarlicUpdateFavorites", function(req, res){
    try{
        console.log("Favorite Update Query");
        console.log(req.query);
        if(!req.session || !req.session.user)
            return res.json({errors:["Can't favorite, not logged in"], msg:null});
        let favorites = database.query("SELECT hotel_id FROM favorites WHERE user_id=?", ["" + req.session.user.userID])
        console.log(favorites);
        if(JSON.stringify(favorites).includes("" + req.query.name)){
            console.log("Item is already in favorites, removing");
            database.query("DELETE FROM favorites WHERE user_id=? AND hotel_id=?", ["" + req.session.user.userID, "" + req.query.name])
            //req.session.user.favorites.splice(req.session.user.favorites.indexOf(req.query.name), 1)
            return res.json({errors:[], msg:"Removed from DB"});
        }else{
            console.log("Item is not in favorites, adding");
            database.query("INSERT INTO favorites(user_id, hotel_id) VALUES (?, ?)", ["" + req.session.user.userID, "" + req.query.name]);
            //req.session.user.favorites.push(req.query.name);
            return res.json({errors:[], msg:null});
        }
    }catch(e){
        return res.json({errors:[e.message], msg:null});
    }
});

/*
app.get("/GarlicListFavorites", function(req, res){
    try{
        console.log("Favorite Update Query");
        console.log(req.query);
        if(!req.session || !req.session.user)
            return res.json({errors:["Can't favorite, not logged in"], favs:null});
        let favorites = database.query("SELECT hotel_id FROM favorites WHERE user_id=?", ["" + req.session.user.userID])
        console.log(favorites);
        return res.json({errors:[], favs:favorites});
    }catch(e){
        return res.json({errors:[e.message], favs:null});
    }
}*/

app.listen(8080);
