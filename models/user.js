var mongoose = require("mongoose"),
passportLocal = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
    username: String,
    contact:{
            email:{type:String, default: "NA"},
            contact:{type:Number, default:0000000000},
    },
    password: String,
    DOB: {type:Date, default:Date.now}
});

userSchema.plugin(passportLocal);

module.exports = mongoose.model("User",userSchema);