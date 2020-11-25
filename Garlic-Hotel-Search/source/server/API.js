"use strict"

/*
    This file is for functions that connect the Hotel Info API to main backend, server.js
*/

class Listing{
    constructor(name, address, bedNums, preTaxNight,
        features, checkin, checkout, image, contactNum, rating, link){
        this.name = name;
        this.address = address;
        this.bedNums = bedNums;
        this.preTaxNight = preTaxNight;
        this.features = features; // list
        this.checkin = checkin;
        this.checkout = checkout;
        this.image = image
        this.contactNum = contactNum;
        this.rating = rating;
        this.link = link;
    }
}

class Bed{
    constructor(name){
        this.name = name; // Full, King or Queen
    }
}

//This function will acess the API and maybe create a JS Listing Obeject array, right now it generates random data
/*function search(searchText, daterange, numBeds){    
    let listings = [];
    for(let i = 0; i < 20; i++){
        let random = Math.floor(Math.random() * 100)
        listings[i] = new Listing("Hotel " + random, random + " Placeholder Road, Boston, MA", random, random *3, 
        ["feature " + (random + 3), "feature " + (random + 3), "feature " + (random + 3)],
        "What is this?", "What is this?", ["imgURL1", "imgURL2", "imgURL3"], "(231) 712-2312", random);
    }
    return listings;
}*/

function search(searchText, daterange, numBeds, res){
    let location = [searchText, "NY"];  //default to NY
    if(searchText.includes(","))
        location = searchText.split(",");
    if(!numBeds)
        numBeds = 2;
    //let dates = searchText.split("-")
    //let date1 = dates[] //dates are a luxary we can do without
    console.log(process.cwd());
    const exec = require("child_process").exec;
    exec(`python scrape.py "` + location[0] + `" "` + location[1] + `" ` + numBeds + ` ` + numBeds + ` 2020 11 30 2020 12 3`, function(error, stdout, stderr){
        try{
            if(stderr)
                return res.json({error:stderr});
            let obj = JSON.parse(stdout);
            let listings = [];
            for(let i = 0; i < obj.hotels.length; i++)
                listings.push(new Listing(obj.hotels[i].name, obj.hotels[i].address, numBeds, obj.hotels[i].preTaxNight, obj.hotels[i].features, 0, 0, obj.hotels[i].image, 0, obj.hotels[i].rating, obj.hotels[i].link));
            res.json(listings);
        }
        catch(err){
            res.json({error:err.message});
        }
    });
}

exports.search = search;