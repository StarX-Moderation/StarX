const Discord = require("discord.js")

module.exports = {

    name: "hire",
    usage: ["Get the current ping of the bot```{prefix}ping```"],
    syntax: "ping",
    enabled: true,
    aliases: [],
    category: "utility",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    subcommands: [{ name: `start`, description: `Starts a giveaway`, usage: `start [time] [no. of winners] [requirement] [prize]` }, { name: `end`, description: `Ends a giveaway early`, usage: `end [giveaway ID]` }, { name: `reroll`, description: `Reroll winners of a giveaway`, usage: `reroll [giveaway ID]` }, { name: `cancel`, description: `Cancels a giveaway`, usage: `cancel [giveaway ID]` }, { name: `list`, description: `Shows list of active giveaways in the server`, usage: `list` }, { name: `entries`, description: `Check entries of any giveaway`, usage: `entries [giveaway ID]` }, { name: `ping`, description: `Ping the giveaway ping role of the server`, usage: `ping <sponsor> <message>` }],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 2000,


    // Execute contains content for the command
    async execute(client, message, args, data) {
        const embed5 = new Discord.MessageEmbed()
        .setAuthor({name: `Error`, iconURL: client.gif.error})
        .setDescription(`You need Manage server permission to hire someone.`)
        .setColor("RED")
        if(!message.member.permissions.has("MANAGE_SERVER")) return message.reply({embeds: [embed5]})
        const embed = new Discord.MessageEmbed()
        .setAuthor({name: `Error`, iconURL: client.gif.error})
        .setDescription(`You have to provide id of the user you want to hire. You can't hire nobody\nSyntax: \`${data.prefix}hire [user ID]\``)
        .setColor("RED")
        if(!args[0]) return message.reply({embeds: [embed]})
        else {
            try{
            const user = await client.users.fetch(args[0])
            const embed2 = new Discord.MessageEmbed()
            .setAuthor({name: `Success`, iconURL: client.gif.success})
            .setDescription(`You have hired ${user.tag} (${user.id})\nMention: <@${user.id}>`)
            .setColor("GREEN")
            const embed3 = new Discord.MessageEmbed()
            .setTitle(`Hey!`)
            .setDescription(`I'm StarX Moderation here to tell you that your application has been ||accepted||`)
            .setColor("GREEN")
            message.reply({embeds: [embed2]})
            return user.send({embeds: [embed3]})
            }catch{
                const embed4 = new Discord.MessageEmbed()
                .setAuthor({name: `Error`, iconURL: client.gif.error})
                .setDescription(`There is no user with that ID in this server`)
                .setColor("RED")
                return message.reply({embeds: [embed4]})
            }
        }



    }
}