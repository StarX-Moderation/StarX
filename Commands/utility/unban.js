const Discord = require("discord.js");
const Guild = require("../../Database/Schema/Guild");

module.exports = {
    //Command Information
    name: "unban",
    description: "Unban anyone.",
    usage: "unbam [arguements]",
    enabled: true,
    aliases: [""],
    subcategory: "**Commands**",
    category: "moderation",
    memberPermissions: ["BAN_MEMBERS"],
    memberp: ["Ban Members"],
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