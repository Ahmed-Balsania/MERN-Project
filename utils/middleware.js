const {reviewSchema} = require('../schemaValidation.js');
const ExpressError = require("../utils/ExpressErr.js");
const Listing = require("../models/listing.js");
const {listingSchema} = require('../schemaValidation');


//to check if user is logged in or not

module.exports.isLoggedIn = (req,res,next)=>{
 if(!req.isAuthenticated()){
 // console.log( req.originalUrl);
 req.session.redirectUrl = req.originalUrl;
  req.flash("error","Please Login to get along");
 return res.redirect("/login");
 }
  return next()
 
};

//to save the url to redirect after login
module.exports.saveUrl = (req,res,next)=>{
 if(req.session.redirectUrl){
  res.locals.redirectUrl = req.session.redirectUrl;
  
 }
 next();
};

//to validate review
module.exports.validateReview = (req,res,next)=>{
 let {error} = reviewSchema.validate(req.body);
 if(error){                                                            //for validating review
  throw new ExpressError(400,error.message); 
 } else {
   next();
 }
};


module.exports.isOwner = async (req,res,next)=>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(req.user._id)){
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  return next();
};

module.exports.validateListing = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  if(error){                                                           //for validating lsitings
   throw new ExpressError(400,error.message); 
  }
    next();
 };

