const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn} = require("../utils/middleware.js");
const reviewController = require("../controllers/review.js");



//review form submit route

router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.addReview)
);

//delete review route

router.delete("/:reviewId",isLoggedIn, wrapAsync(reviewController.destroyReview)
);

module.exports = router;