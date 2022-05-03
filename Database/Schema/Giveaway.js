const mongoose = require("mongoose"),
    config = require("./../../config.json");

module.exports = mongoose.model("Giveaway", new mongoose.Schema({
    id: {type: String},
    prize: {type: String},
    time: {type: Number}, 
    requirement: {type: Array},
    numberofwinners: {type: Number},
    endingtime: {type:Number},
    host: {type: String},
    channel: {type: String},
    guild: {type: String},
    participant: {type: Array, default: []},
    ended: {type: Boolean, default: false}

}))