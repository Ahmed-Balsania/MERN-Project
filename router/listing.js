const express = require("express");
const router  = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const {isLoggedIn,isOwner,validateListing} = require("../utils/middleware");
const listingController = require("../controllers/listing");
const multer  = require('multer');
const {storage} = require("../cloudConfig");
const upload = multer({ storage });
const Listing = require("../models/listing");



router.use(express.urlencoded({extended:true}));


//listing route

router.get("/",
  wrapAsync(listingController.allListings)
);

//New property form route

router.get("/new",isLoggedIn,
  listingController.newFormRender); 

  router.post("/in",listingController.searchListing);
//add route

router.post("/",upload.single('listing[image]'),
  wrapAsync(listingController.addListings));

router.post("/askAi",listingController.aiResponse);
//single listing item route , read

router.get("/:id",
   wrapAsync(listingController.showSingleListing));

//update route, form

router.get("/:id/edit",isLoggedIn,isOwner,
   wrapAsync(listingController.renderEditForm));

//update route, update

router.put("/:id",isOwner,upload.single('listing[image]'),validateListing,
   wrapAsync(listingController.updateListing));

//delete route

router.delete("/:id",isLoggedIn,isOwner,
   wrapAsync(listingController.destroyListing));

module.exports = router;