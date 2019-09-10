var mongoose = require("mongoose");

var gameSchema = new mongoose.Schema({
    title:String,
    image: String,
    type: String,
    launch : {type : Date, default: Date.now},
    desc: {type: String, default: "NA"}
});

module.exports = mongoose.model("game",gameSchema);
