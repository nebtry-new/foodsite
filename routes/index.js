var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req,res){
    res.render("landing");
});

// ============
// AUTH ROUTES
// ============

// show register form
router.get("/register", function(req, res) {
    res.render("register");
});
// handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           res.redirect("/register");
       }
       passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to FoodSite " + user.username);
           res.redirect("/foods");
       });
   });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});
// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/foods",
        failureRedirect: "/login",
        successFlash: "Welcome back",
        failureFlash: true
    }), function(req, res) {
        res.send("LOGIN LOGIC HAPPENS HERE!");
});

// logic route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/foods");
});

module.exports = router;
