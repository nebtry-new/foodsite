var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash       = require("connect-flash"),
    Food = require("./models/food"),
    Comment    = require("./models/comment"),
    User       = require("./models/user");

// requiring routes
var commentRoutes    = require("./routes/comments"),
    foodRoutes = require("./routes/food"),
    indexRoutes       = require("./routes/index");
    
//mongoose.connect("mongodb://localhost/foodSite");
mongoose.connect("mongodb://pik:02597603@ds251849.mlab.com:51849/foodsite");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();
    
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: 'Pik is a good guy',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/foods",foodRoutes);
app.use("/foods/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Food Site Server has started!");
});
