const Discord = require("discord.js");
const Guild = require("../../Database/Schema/Guild");
module.exports = {
    //Command Information
    name: "appealconfig",
    description: "Setup Ban Appeals!",
    usage: "applyconfig",
    enabled: true,
    aliases: ["None"],
    category: "server",
    subcategory: "Ban Appeal",
    memberPermissions: ["MANAGE_GUILD"],
    memberp:[`Manage Server`],
    subcommand: [{name: `set`, usage: `set [setting] [arguement]`, description: `Change any setting.`}],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS", "BAN_MEMBERS" ],
    botp: ["Send Messages, Embed Links"],
    nsfw: false,
    cooldown: 0,
    ownerOnly: false,

    async execute(client, message, args, data) {
        
        let guild = await Guild.findOne({id: message.guild.id})
        if(!guild) guild = new Guild({id: message.guild.id})
        if(!guild.appeal) guild.appeal = {channel: `none`, enabled: false, reason: true}
        const embed = new Discord.MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
        .setTitle(`**__Ban Appeal Settings__**`)
        .setColor(`139090`)
        .setDescription(`Use \`${data.prefix}appealconfig [setting] [arguement]\` to change any setting.`)
        .addField(`**Log Channel**`, `**Setting** : \`log\`\n**Current Setting** : ${guild.appeal.channel === `none` ? `\`none\`` : `<#${guild.appeal.channel}>`}\nAppeal will be sent in this channel.\n**Note** : \`enabled\` setting will automatically toggle to \`true\` if this setting is changed.`, true)
        .addField(`**Reason**`, `**Setting** : \`reason\`\n**Current Setting** : \`${guild.appeal.reason}\`\nToggle whether reason for ban has to be shown to the user who is appealing`, true)
        .addField(`**Enabled**`, `**Setting** : \`enabled\`\n**Current Setting** : \`${guild.appeal.enabled}\`\nToggle whether appeals for this server are enabled or not.`, true)
        if(!args[0]){
            return message.channel.send({embeds: [embed]})
        }
        if(args[0] === `log`){
            if(!args[1]) return message.channel.send(`You have to provide a channel.`)
            const channel = await client.channels.cache.find(r => args[1].includes(r.id))
            if(!channel) return message.reply(`Cannot find that channel.`)
            else if(channel){
                guild.appeal.channel = channel.id // Enable settings
                guild.appeal.enabled = true
                guild.markModified("appeal");
                await guild.save();
                return message.react(client.emotes.tick)
            }
        }
        if(args[0] === `enabled`){
            if(!args[1]) return message.channel.send(`You have to choose \`true/false\``)
            if(args[1].toLowerCase() === `true`||args[1].toLowerCase() === `on`||args[1].toLowerCase() === `enabled`){
                guild.appeal.enabled = true
                guild.markModified("appeal")
                await guild.save()
                return message.react(client.emotes.tick)
            }
            if(args[1].toLowerCase() === `false`||args[1].toLowerCase() === `off`||args[1].toLowerCase() === `disable`){
                guild.appeal.enabled = false
                guild.markModified("appeal")
                await guild.save()
                return message.react(client.emotes.tick)     
            } else {return message.reply(`You have to choose \`true/false\``)}
        }      
        if(args[0] === `reason`){
            if(!args[1]) return message.channel.send(`You have to choose \`true/false\``)
            if(args[1].toLowerCase() === `true`||args[1].toLowerCase() === `on`||args[1].toLowerCase() === `enabled`){
                guild.appeal.reason = true
                guild.markModified("appeal")
                await guild.save()
                return message.react(client.emotes.tick)
            }
            if(args[1].toLowerCase() === `false`||args[1].toLowerCase() === `off`||args[1].toLowerCase() === `disable`){
                guild.appeal.reason = false
                guild.markModified("appeal")
                await guild.save()
                return message.react(client.emotes.tick)     
            } else {return message.reply(`You have to choose \`true/false\``)}
        } else {
            return message.channel.send(`That's not a valid setting.`)
        }
    }
    
}