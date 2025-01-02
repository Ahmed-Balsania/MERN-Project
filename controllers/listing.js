
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressErr");


module.exports.allListings = async (req,res)=>{
 let listings = await Listing.find({});
 res.render("./listings/home.ejs",{listings});
};

module.exports.newFormRender = (req,res)=>{
 return res.render("./listings/new.ejs");
};
module.exports.addListings = async(req,res,next)=>{
  let  url = req.file.path;
  let filename = req.file.filename;
 // console.log(url,filename);
  let newListing = new Listing(req.body.listing);
  console.log(req.user);
  newListing.owner = req.user._id;
  newListing.image = {url:url,filename:filename}
  await newListing.save();
  req.flash('success', 'Listing Added Successfully');
 return res.redirect("/listings");
};

module.exports.searchListing = async (req,res)=>{
   let {location} = req.body;
   let listing = await Listing.find({$or:[{ location: location },{country:location}]});
  //  console.log(listing);
   if(listing.length>0){
     return res.render("./listings/home.ejs", { listings: listing });
   }else{
      req.flash("error","Listing Not Found");
     return res.redirect("/listings"); 
   }
  };

module.exports.showSingleListing = async (req,res)=>{
 let {id} = req.params;
 let item = await Listing.findById(id).populate({path : 'reviews', populate : {path : 'author'}}).populate("owner");
 res.render("./listings/show.ejs",{item});
};

module.exports.renderEditForm = async(req,res)=>{
 let {id} = req.params;
 let listing = await Listing.findById(id);

 let ogUrl = listing.image.url;
 ogUrl = ogUrl.replace("/upload","/upload/w_300,h_200"); 
 res.render("./listings/update.ejs",{listing,ogUrl});
};

module.exports.updateListing = async(req,res)=>{
 let {id} = req.params;
 let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
 if(typeof req.file !== "undefined"){
  let  url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url:url,filename:filename}
  await listing.save();
 }


 req.flash('success', 'Listing Updated Successfully');
 res.redirect("/listings");
};

module.exports.destroyListing = async(req,res)=>{
 let {id} = req.params;
 await Listing.findByIdAndDelete(id);
 console.log("deleted");
 req.flash('success', 'Listing Deleted Successfully');
 res.redirect("/listings");
};
