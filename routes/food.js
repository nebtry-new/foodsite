var express = require("express");
var router = express.Router();
var Food = require("../models/food");
var middleware = require("../middleware");

// INDEX - show all
router.get("/", function(req,res){
    // Get all food from DB
    Food.find({}, function(err, allFoods){
        if(err){
            console.log(err);
        }else{
            res.render("foods/index", {foods: allFoods});
        }
    });
});

// CREATE - add new and redirect
router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    
    var newFood = {name: name, price: price, image: image, description: desc, author: author};
    
    // Create a new food and save to DB
    Food.create(newFood, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log(newlyCreated);
            res.redirect("/foods");
        }
    });
});

// NEW - show form to create new food
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("foods/new");
});

// SHOW - shows more info about one food
router.get("/:id", function(req, res) {
   Food.findById(req.params.id).populate("comments").exec(function(err, foundFood){
      if(err){
          console.log(err);
      }else{
          console.log(foundFood);
          res.render("foods/show", {food: foundFood}); 
      }
   });
});

// EDIT FOOD ROUTE
router.get("/:id/edit", middleware.checkFoodOwnership, function(req, res){
    Food.findById(req.params.id, function(err, foundFood){
        if(err){
            res.redirect("/foods");
        }else{
            res.render("foods/edit", {food: foundFood});
        }
    });
})

// UPDATE FOOD ROUTE
router.put("/:id", function(req, res){
    // find and update food
    Food.findByIdAndUpdate(req.params.id, req.body.food, function(err, updatedFood){
        if(err){
            res.redirect("/foods");
        }else{
            res.redirect("/foods/" + req.params.id);
        }
    });
});

// DESTROY FOOD ROUTE
router.delete("/:id", middleware.checkFoodOwnership, function(req, res){
   Food.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/foods");
       }else{
           res.redirect("/foods");
       }
   });
});

module.exports = router;