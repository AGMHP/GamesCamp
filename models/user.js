var mongoose = require("mongoose"),
passportLocal = require("passport-local-mongoose");


var userSchema = new mongoose.Schema({
    name: String,
    contact:{
        email:{type:String, default:"name"},
        contact:{type:Number, default:0000000000},
    },
    DOB: {type:Date, default:Date.now}
});

userSchema.plugin(passportLocal);

module.exports = mongoose.model("User",userSchema);