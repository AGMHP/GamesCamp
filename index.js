var express=  require("express");
var app = express();
const bodyParser = require('body-parser');
let mongoose = require("mongoose");
var game = require("./models/game");

mongoose.connect("mongodb://localhost:27017/game_app",{ useNewUrlParser: true});
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: true }));

//RESTFULL Routes
app.get('/',  (req, res) => {
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

app.post('/games',  (req, res) => {
    console.log(req.body);
    // var newGame = {title:req.body.gameName, type:req.body.gameType, image:req.body.gamePoster};
    game.create(req.body.game, game.find({},function(err,game){
         if (err) {
             console.log(err);
         } else {
             console.log(game);
            //res.render('games',{game:game}); 
        }
    }));
});  

app.get('/games/:id',  (req, res) => {
        game.findById(req.params.id, function(err,game){
            if (err) {
                console.log(err);
            } else {
                res.render('game',{game:game}); 
            }
        });
});  

//Auth Routes

app.get('/signup',  (req, res) => {
    res.render('signup');
});

app.get('/login',  (req, res) => {
    res.render('login');
});

app.listen(3003, () => {
    console.log("running at 3003");
});
  