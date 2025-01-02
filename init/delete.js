const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const Review = require('../models/review.js');
const User = require("../models/user.js");
const initData = require("./data.js");

let  url = process.env.ATLAS_URL
async function main(){
 await mongoose.connect("mongodb+srv://ahmedbalsania7:uc3ixrTtZZw9PfgX@cluster0.e9ufi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");          //DB CONNECTION FUNC
} 


//DB CONNECTION

main()                                                                 
.then((res)=>{
 console.log("connected");     
})
.catch((err)=>{
 console.log(err);
})


async function hello(){
 await Listing.deleteMany({});
 initData.data = initData.data.map((obj)=> ({...obj,owner:"6776ad8ce6ba81883cc70234"}));
 await Listing.insertMany(initData.data);
 console.log("data was added");
}

hello();