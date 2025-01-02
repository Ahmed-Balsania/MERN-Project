const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.addReview = async (req,res)=>{
 let {id} = req.params;
 let listing = await Listing.findById(id);
 let newReview = new Review(req.body.review);
 newReview.author = req.user._id;
 listing.reviews.push(newReview);
 
 await newReview.save();
 await listing.save(); 
 req.flash('success', 'Review Added Successfully');
 res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async(req,res,next)=>{
 let {id,reviewId} = req.params;
 await Listing.findOneAndUpdate({_id:id}, {$pull:{reviews:reviewId}});
 await Review.findByIdAndDelete(reviewId);
 req.flash('success', 'Review Deleted Successfully');
 res.redirect(`/listings/${id}`);
};