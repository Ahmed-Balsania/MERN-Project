const User = require("../models/user");



module.exports.renderSigupForm = async(req,res)=>{
 res.render("./user/signup.ejs");
};

module.exports.signup = async(req,res)=>{
 try{
  let {username,password,email} = req.body;
 const newUser = new User({email,username});
 let regUser = await User.register(newUser,password);
 console.log(regUser);
 req.login(regUser,(err)=>{
 if(err){
  return next(err);
 }
 req.flash("success","Signed Up successfully");
  return res.redirect("/listings");
 }); 

 } 
 catch(e){
  req.flash("error",e.message);
 return res.redirect("/signup");
 }
};

module.exports.renderLoginForm = (req,res)=>{
 res.render("./user/login.ejs");
};

module.exports.login =  async(req,res)=>{
 req.flash("success","Welcome to wanderlust");
 const URL = res.locals.redirectUrl || "/listings";
 return res.redirect(URL);
};

module.exports.logout = (req,res)=>{
 req.logOut(()=>{
   req.flash("success","You Logged Out Successfully");
   res.redirect("/listings");
 })
}; 

