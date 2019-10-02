var game = require("../models/game");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        game.findById(req.params.id, function(err, foundPost){
            console.log(game);
           if(err){
               res.redirect("back");
           }  else {
               // does user own the post?
            if(foundPost.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } 
    else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, foundComment){
        if(err){
            res.redirect("back");
        }  else {
            // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
        }
        });
    } 
    else {
            res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;
