if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressErr.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

let listingRouter = require("./router/listing.js");                       //requiring listings routes
let reviewRouter = require("./router/review.js");                          //requiring reviews routes
let userRouter = require("./router/user.js");                               //requiring user routes


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

const dbUrl = process.env.ATLAS_url

async function main(){
 await mongoose.connect(dbUrl);          //DB CONNECTION FUNC
} 

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SESSION_SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("error in mongo store");
})

 const sessionOptions = {           
  store:store,             // session options
  secret: process.env.SESSION_SECRET,                        
  resave: false,                              
  saveUninitialized: true,
};

app.use(session(sessionOptions));           //express sessions
app.use(flash());

app.use(passport.initialize());                      //passport 
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{                               //flash MW
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings",listingRouter);                                   //using listing routes
app.use("/listings/:id/reviews",reviewRouter);                         //using review routes
app.use("/",userRouter);

//DB CONNECTION

main()                                                                 
.then((res)=>{
 console.log("connected");     
})
.catch((err)=>{
 console.log(err);
})

//Error handler for req on undefined page

// app.all("*",(req,res,next)=>{
//   next(new ExpressError(404,"Page Not Found!"));
// });

//ERROR HANDLER

 app.use((err,req,res,next)=>{
  if(res.headersSent){
    return next(err);
  }
  let {status=500,message="somethimg went wrong"} = err;
  res.status(status).render("error.ejs",{message});
 }); 


//LISTENING REQ , STARTING SERVER

app.listen(8080,()=>{                                              
  console.log("listening");
 });







