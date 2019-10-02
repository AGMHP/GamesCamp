var express         =  require("express"),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    passportLocal   = require("passport-local"),
    user            = require("./models/user"),
    method          = require("method-override");

//requring routes
var gameRoutes    = require("./routes/game"),
    commentRoutes = require("./routes/comments"),
    authRoutes      = require("./routes/authorization");

app.use(method("_method"))
mongoose.connect("mongodb://localhost:27017/game_app",{ useNewUrlParser: true, useFindAndModify:true});
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Aghori!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use("/", authRoutes);
app.use("/games", gameRoutes);
app.use("/games/:id/comment", commentRoutes);

app.listen(3003, () => {
    console.log("running at 3003");
});
  