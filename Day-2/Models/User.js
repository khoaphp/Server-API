const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Username: String,
    Password: String,
    Active: Boolean,
    CodeActive: String,
    Group: Number,
    RegisterDate: Date,

    HoTen:String,
    Email:String,
    SoDT:String,
    DiaChi:String
});

module.exports = mongoose.model("User", userSchema);