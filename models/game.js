var mongoose = require("mongoose");

var gameSchema = new mongoose.Schema({
    title:String,
    image: String,
    type: String,
    launch : {type : Date, default: Date.now},
    desc: {type: String, default: "NA"},
    author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "comment"
        }
     ]
});

module.exports = mongoose.model("game",gameSchema);
