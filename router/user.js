const express = require("express");
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveUrl} = require("../utils/middleware");
const userController = require("../controllers/user");
const { render } = require("ejs");

//signup form

router.get("/signup",userController.renderSigupForm);


// signup submithello world

router.post("/signup",wrapAsync(userController.signup));


//login form

router.get("/login",userController.renderLoginForm);


//login submit

router.post("/login",saveUrl,
 passport.authenticate('local', { failureRedirect: '/login',failureFlash:true, }),
 userController.login
);

router.get("/logout",userController.logout);

module.exports = router;

