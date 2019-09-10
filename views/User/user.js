var mongoose = require("mongoose");

var user = new mongoose.Schema({
    name: String,
    contact:{
        email:String,
        contact:Number,
    },
    DOB: Date
});