var Food = require("../models/food.js");
var Comment = require("../models/comment.js");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkFoodOwnership = function(req, res, next){
    // Is user logged in ?
    if(req.isAuthenticated()){
        Food.findById(req.params.id, function(err, foundFood){
            if(err){
                req.flash("error", "Food not found");
                res.redirect("back");
            }else{
                // does user own the food ?
                if(foundFood.author.id.equals(req.user._id)){
                   return next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    // Is user logged in ?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Something went wrong");
                res.redirect("back");
            }else{
                // does user own the comment ?
                if(foundComment.author.id.equals(req.user._id)){
                   next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;