const mongoose = require("mongoose"),
    config = require("./../../config.json");

module.exports = mongoose.model("Guild", new mongoose.Schema({

    id: { type: String }, //ID of the guild
    registeredAt: { type: Number, default: Date.now() },
    prefix: { type: String, default: config.prefix },
    giveaway: { type: Object, default: {
        roles: [],
        emote: "970538833642934303",
        medium: "button",
        alwaysallowedroles: [],
        blacklistedroles: [],
        pingrole: 'none'
        }
    },
    premium: false,
    raffle: {type: Array, default: []},


}));