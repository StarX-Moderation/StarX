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
    adcases: {type: Number, default: 1},
    premium: false,
    raffle: {type: Array, default: []},
    appeal: {type: Object, default: {channel: `none`, enabled: false, reason: true, server: `830425631367626753`, channel: `848175916555305000`}},
}));



module.exports.app = mongoose.model("Application/Appeals/Reports", new mongoose.Schema({
    id: { type: String }, //ID of the guild
    report: {type: String, default: undefined},
    appeal: {type: Object, default: {channel: `none`, enabled: false, reason: true}},
  
    review: {type: String, default: `None`},
    dm: {type: String, default: true},
    channel: {type: String, default: `None`},
    blacklist: {type: String, default: `None`},
    log: {type: String, default: `None`},
    applications: {type: Array, default: []},
    applied: {type: Array, default: []},
  }))