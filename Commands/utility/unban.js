const Discord = require("discord.js");
const Guild = require("../../Database/Schema/Guild");

module.exports = {
    //Command Information
    name: "unban",
    description: "Start a raffle in Server.",
    usage: "raffle [arguements]",
    enabled: true,
    aliases: [""],
    subcategory: "**Commands**",
    category: "utility",
    memberPermissions: ["BAN_MEMBERS"],
    memberp: ["Manage Server"],
    subcommand: [{name: `start`, description: `Start Raffle`, usage: `start`}, {name: `entries`, description: `check entries of raffle.`, usage: `entries`}, {name: `status`, description: `Check status of raffle.`, usage: `status`}, {name: `end`, description: `End raffle.`, usage: `end`}, {name: `addticket`, description: `Add tickets of Users.`, usage: `addticket [users:<no. of tickets>]`}, {name: `reset`, description:`Reset the current raffle.`, usage: `reset`}],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS" ],
    botp: ["Send Messages, Embed Links, Add Reactions"],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {
        if(!args[0]) return
        if(args[0]){
            let e = await message.guild.bans.fetch(args[0])
            if(e){
            message.guild.bans.fetch(args[0]).remove()
            message.reply(`Unbanned ${e.user.name}`)
        }}



    }
}