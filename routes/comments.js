var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    comment    = require("../models/comment"),
    game       = require("../models/game"),
    middleWare  = require("../middleware/middleware");

//Reviews(Comments) Route
router.get('/new', middleWare.isLoggedIn , (req, res) => {
    game.findById(req.params.id, function(err,game){
        if (err) {
            console.log(err);
        } else {
            res.render("./comment/newComment",{game:game});
        }
    });
});

router.post('/', middleWare.isLoggedIn ,  (req, res) => {
    game.findById(req.params.id, function(err, game){
        if(err){
            console.log(err);
            res.redirect("/");
        } 
        else {
         comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                author = {
                        id: req.user._id,
                        username: req.user.username
                };
                comment.author = author;
                comment.save();
                console.log(comment);
                game.comments.push(comment);
                game.save();
                res.redirect('/games/' + game._id);
            }
         });
        }
    });
});

router.get('/update/:commentId', middleWare.checkCommentOwnership , (req, res) => {
    game.findById(req.params.id).populate("comments").exec(function(err, game){
        comment.findById(req.params.commentId, function(err,comment){
            if (err) {
                console.log(err);
            } else {
                res.render("./comment/updateComment",{game:game, comment:comment});
            }
        });
    });
});

router.post('/update/:commentId',  (req, res) => {
    comment.findByIdAndUpdate(req.params.commentId, {$set: req.body.updatecomment}, function(err, comment)
    {
        if(err){
            console.log(err);
        } 
        else {
            res.redirect('/games/' + req.params.id);
        }
    });
});

router.get('/:commentId' , middleWare.checkCommentOwnership, (req, res) => {
    //Delete Comments
    //deleting comment refrence from game 
    game.findById(req.params.id).populate("comments").exec(function(err, game){
        game.comments.pull({_id:req.params.commentId});
        game.save();
        //deleting comment itself
        comment.findByIdAndRemove(req.params.commentId, function (err,comment) 
        {
            console.log(comment);
        }); 
    res.redirect('/games/' + req.params.id);
    });
});


module.exports = router;