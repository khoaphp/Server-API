const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    Ten: String,
    SP: [mongoose.Schema.Types.ObjectId]
});

module.exports = mongoose.model("LoaiSP", tokenSchema);