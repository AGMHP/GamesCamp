var express         =  require("express"),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    passportLocal   = require("passport-local"),
    game = require("./models/game") ,
     User= require("./models/user"),
      comment= require("./models/comment");

mongoose.connect("mongodb://localhost:27017/game_app",{ useNewUrlParser: true, useFindAndModify:true});
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});


//RESTFULL Routes to show
app.get('/',isLoggedIn, (req, res) => {
    game.find({},function(err,game){
        if (err) {
            console.log(err);
        } else {
            res.render('home',{game:game});     
        }
    });
  });

app.get('/games',  (req, res) => {
    game.find({},function(err,game){
        if (err) {
            console.log(err);
        } else {
            res.render('games',{game:game});     
        }
    });
}); 

app.post('/games',function(req, res){
    game.create(req.body.game, function(err,game){
        if (err) {
            console.log(err);
        } else {
           res.redirect('/'); 
       }
    });
});  

app.get('/games/:id',  (req, res) => {
        game.findById(req.params.id).populate("comments").exec(function(err, game){
            if (err) {
                console.log(err);
            } else {
                res.render('game',{game:game}); 
            }
        });
});

//Reviews(Comments) Route
app.get('/games/:id/comment/new',  (req, res) => {
    game.findById(req.params.id, function(err,game){
        if (err) {
            console.log(err);
        } else {
            res.render("./comment/newComment",{game:game});
        }
    });
});

app.post('/games/:id/comment',  (req, res) => {
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
                game.comments.push(comment);
                game.save();
                res.redirect('/games/' + game._id);
            }
         });
        }
    });
});

app.get('/games/:id/comment/update/:updateId',  (req, res) => {
    game.findById(req.params.id).populate("comments").exec(function(err, game){
        comment.findById(req.params.updateId, function(err,comment){
            if (err) {
                console.log(err);
            } else {
                res.render("./comment/updateComment",{game:game, comment:comment});
            }
        });
    });
});

app.post('/games/:id/comment/update/:updateId',  (req, res) => {
    console.log(req.body.updatecomment);
    comment.findByIdAndUpdate(req.params.updateId, {$set: req.body.updatecomment}, function(err, comment)
    {
        console.log(comment);
        if(err){
            console.log(err);
        } 
        else {
            console.log(comment);
            res.redirect('/games/' + req.params.id);
        }
    });
});

app.get('/games/:id/comment/:delete',  (req, res) => {
    //Delete Comments
    //deleting comment refrence from game 
    game.findById(req.params.id).populate("comments").exec(function(err, game){
        game.comments.pull({_id:req.params.delete});
        game.save();
        console.log(game);
        //deleting comment itself
        comment.findByIdAndRemove(req.params.delete, function (err,comment) 
        {
            console.log(comment);
        }); 
    res.redirect('/games/' + req.params.id);
    });
});

//Auth Routes
app.get('/signup',  (req, res) => {
    res.render('./users/signup');
});


////////////////////////////////////////////////
// app.post("/signup", function(req, res){
//     var newUser = req.body.user;
//     // {   username:req.body.user.name, 
//         //     DOB: req.body.user.DOB, 
//         //     contact :{
//         //                 email:req.body.user.contact.email
//         //             }
//         // }, 
//     user.register( {username:newUser.username},req.body.password, (req, res) => passport.authenticate('local', 
//     {   
//         successRedirect: '/', 
//         failureRedirect: '/login', 
//     })
//     (req, res)
//     );
// });

app.post("/signup", function (req, res, next) {

    var newUser = new User({
        username: req.body.user_name
    });
    User.register(newUser, req.body.password, function (err, user) {
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
app.get('/login',  (req, res) => {
    res.render('./users/login');
});

// handling login logic
// app.post("/login",passport.authenticate("local", (user,req,res) =>
//             { 
//                 console.log(user);
//                 if(user){
//                     console.log(user);
//                     res.redirect("/");
//                 }
//                 console.log(err);
//             },)
//     // function(req,res){
//     //         res.redirect("/");
//     //     }
// );
app.post('/login', (req, res) => passport.authenticate('local', 
    {   
        successRedirect: '/', 
        failureRedirect: '/login', 
    })
    (req, res)
);

// logic route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

function isLoggedIn(req, res, next){
    console.log(res.locals.currentUser)
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3003, () => {
    console.log("running at 3003");
});