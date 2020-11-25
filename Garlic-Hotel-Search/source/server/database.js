"use strict"

/*
    This file is for functions that connect the SQL database to main backend, server.js
*/

//=========================== Required Libs ============================================================================================================================

const mysqlSync = require("sync-mysql");                        //Syncronous SQL database queries
const bcrypt = require("bcrypt");                               //Password Hashing
const credValidator = require("../client/js/userCode");        //Username and Pasword Validation
const databaseCreds = require("./databaseCredentials.json");    //Database Username, Password, and Host

let database = new mysqlSync(databaseCreds);

function hashPassword(password){
    return bcrypt.hashSync(password, Number(10));
}

String.prototype.hashCode = function(){
	let hash = 0;
	if(this.length == 0) return hash;
	for(let i = 0; i < this.length; i++){
		let char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

//=========================== User Models ==============================================================================================================================
//All SQL queries should take place exclusively within the User Model

//This object models a user
class User{
    userID         //User ID must be private so it dosn't turn into JSON and get sent client side, also shouldn't be changed from outside
    #oldFavorites   //preserve the orginal favorites updating favorites
    #deleted        //Weather the object has been deleted
    /*  1) new User(username) : get a user who already exists
        2) new User(username, password, prevPassword, email, phone) : create a new user  */
    constructor(...params){
        if(params.length == 5){  // constructor of type 1
            for(let i = 0; i < params.length; i++)
                if(params[i] === "")
                    params[i] = "NULL";
            if(database.query("SELECT user FROM users WHERE user=?", [params[0]]).length != 0)
                throw new Error("Username is already taken!");
            database.query("INSERT INTO users(user, pw, pw_prev, email, phone) VALUES (?, ?, ?, ?, ?)", params);
        }else if(params.length != 1) // constructor of type neither one nor 2
            throw new Error("Invalid Construction of User Object");
        let row = database.query('SELECT * FROM users WHERE user=?', [params[0]])[0];
        this.userID = row.id;
        this.username = row.user;
        this.email = row.email;
        this.phone = row.phone;
        this.favorites = database.query("SELECT hotel_id FROM favorites WHERE user_id=?", ["" + this.userID]);
        this.passHash = row.pw;
        this.prevPassHash = row.pw_prev;
        this.#deleted = false;
        this.#oldFavorites = this.favorites;    //preserve the orginal favorites updating favorites
    }

    //return user info to the client
    getClientObject(){
        return {username: this.username, email: this.email, phone: this.phone, favorites: this.favorites};
    }

    updateInDB(){ //Update user with any changed properties in the database
        if(this.#deleted)
            throw new Error("Can not update a deleted user!");
        database.query("UPDATE users SET user=?, pw=?, pw_prev=?, email=?, phone=? WHERE id=?",[
            this.username, this.passHash, this.prevPassHash, this.email, this.phone]);
        let deletedFavs = this.#oldFavorites.filter(e => !this.favorites.includes(e)); //in oldFavorites not favorites  
        for(let i = 0; i < deletedFavs.length; i++) 
            database.query("DELETE FROM favorites WHERE user_id=? AND hotel_id=?", ["" + this.userID, deletedFavs[i]]);
        let newFavs = this.favorites.filter(e => !this.#oldFavorites.includes(e));      //in favorites not oldFavorites
        for(let i = 0; i < newFavs.length; i++)
            database.query("INSERT INTO favorites(user_id, hotel_id) VALUES (?, ?)", ["" + this.userID, newFavs[i]]);
    }

    removeFromDB(){     //remove a user from the database
        this.#deleted = true;
        database.query("DELETE FROM users WHERE user_id=?", ["" + this.userID]);
        database.query("DELETE FROM favorites WHERE user_id=?", ["" + this.userID]);
    }

    authenticate(password){     //determine if a user really is 

    }
}

exports.User = User;

class UserRes{
    constructor(user = null, errors = []){
        this.user = user;
        this.errors = errors;
    }

    makeClientSafe(){
        if(this.user)
            this.user = this.user.getClientObject();
        return this;
    }
}

exports.UserRes = UserRes;

//=========================== User Functions ==============================================================================


function getFavs(user){
    return database.query("SELECT hotel_id FROM favorites WHERE user_id=?", ["" + user.userID])
}
exports.getFavs = getFavs;

function newUser(query){
    let username = query.username || "", password = query.password || "", email = query.email || "", phone = query.phone || "";
    let returnObject = new UserRes();
    try{
        //returnObject.errors = credValidator.credValidation(username, password, email, phone);     //re-validate credentials server side
        if(returnObject.errors.length != 0){
            returnObject.errors.push("If you are seeing this message, you are illegally using the /GarlicAccountCreationEndpoint endpoint")
            return returnObject;
        }
        let pwHash = hashPassword(password);
        returnObject.user = new User(username, pwHash, "", email, phone);
    }catch(error){
        returnObject.errors.push("Server Side Error: " + error.message)
    }finally{
        return returnObject;
    }
}

exports.newUser = newUser;

//get a query with username and password, return a user object to be saved in the session
function authenticate(query){
    let username = query.username, password = query.password;
    let returnObject = new UserRes();
    try{
        returnObject.user = new User(username);
        if(bcrypt.compareSync(password, returnObject.user.passHash))
            returnObject.user = new User(username);
    }catch(error){
        returnObject.errors.push("Server Side Error: " + error.message)
    }finally{
        return returnObject;
    }
}

exports.authenticate = authenticate;

function updateDetails(query, user){
    let email = query.email || "", phone = query.phone || "";
    let returnObject = new UserRes();
    try{
        returnObject.errors = credValidator.credValidation("thisIsAValidUsername", "thisIsAValidPassword1122", email, phone);     //re-validate credentials server side
        if(returnObject.errors.length != 0){
            returnObject.errors.push("If you are seeing this message, you are illegally using the /GarlicAccountUpdateEndpoint endpoint")
            return returnObject;
        }
        user.email = email;
        user.phone = phone;
        user.updateInDB();
    }catch(error){
        returnObject.errors.push("Server Side Error: " + error.message)
    }finally{
        return returnObject;
    }
}

exports.updateDetails = updateDetails;

function deleteUser(query){}

exports.deleteUser = deleteUser;

function addFavorite(){}

exports.addFavorite = addFavorite;

function removeFavorite(){}

exports.removeFavorite = removeFavorite;