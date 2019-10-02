var express     = require("express"),
    game        = require("../models/game"),
    middleWare  = require("../middleware/middleware"),
    router      = express.Router();

//RESTFULL Routes to show games

router.get('/new', middleWare.isLoggedIn , (req, res) => {
     res.render("./game/gameNew");       
});

router.post('/new', middleWare.isLoggedIn ,  (req, res) => {
    var Game = req.body.game;
    author = {
        id: req.user._id,
        username: req.user.username
    };
    Game.author = author;
    game.create(Game, function(err, game){
        if(err){
            console.log(err);
            res.redirect("/");
        } 
        else {
                
                game.save();
                res.redirect('/games/' + game._id);
            }
    });
        
});

router.get('/:id',  (req, res) => {
        game.findById(req.params.id).populate("comments").exec((err, game)=>{
            if (err) {
                console.log(err);
            } else {
                res.render('game',{game:game}); 
            }
        });
});

router.get('/update/:id', middleWare.checkPostOwnership , (req, res) => {
    game.findById(req.params.id, function(err, game){
            if (err) {
                console.log(err);
            } else {
                console.log(game);
                res.render("./game/gameUpdate",{game:game});
            }
    });
});

router.post('/update/:id',  (req, res) => {
    game.findByIdAndUpdate(req.params.id, {$set: req.body.gameUpdate}, function(err, game)
    {
        if(err){
            console.log(err);
        } 
        else {
            res.redirect('/games/' + req.params.id);
        }
    });
});

router.get('/delete/:id', middleWare.checkPostOwnership , (req, res) => {
    //Delete Comments
    //deleting comment refrence from game 
    game.findByIdAndRemove(req.params.id ,function(err, game){
        if (err) {
            console.log(err);
        } else {
            res.redirect('/games/');        
        }
    });
});



module.exports = router;
