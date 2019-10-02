var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    game        = require("../models/game")
    user        = require("../models/user");

//Auth Routes
router.get('/',  (req, res) => {
    game.find({},function(err,game){
        if (err) {
            console.log(err);
        } else {
            res.render('home',{game:game});     
        }
    });
  });

router.get('/games',  (req, res) => {
    game.find({},function(err, game){
            if (err) {
                console.log(err);
            } else {
                res.render('games',{game:game});     
            }
    });
}); 


router.get('/signup',  (req, res) => {
    res.render('./users/signup');
});

router.post("/signup", function (req, res, next) {

    var newUser = new user({
        username: req.body.username,
        contact:{
            email: req.body.user.contact.email,
        },
        DOB : req.body.user.DOB
    });
    user.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }

        // go to the next middleware
        next();
    });
}, passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/login' 
    })
);

// show login form
router.get('/login',  (req, res) => {
    res.render('./users/login');
});

// handling login logic
router.post('/login', (req, res) => passport.authenticate('local', 
{   
    successRedirect: '/games/', 
    failureRedirect: '/login', 
})
(req, res)
);

// logic route
router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

module.exports = router;