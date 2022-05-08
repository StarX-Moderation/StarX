const Discord = require("discord.js")

module.exports = {

    name: "ad",
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
            .setAuthor({ name: `Error`, iconURL: client.gif.error })
            .setDescription(`You need Manage server permission to hire someone.`)
            .setColor("RED")

        if (!message.member.roles.cache.has("971566807813087253") && !message.member.permissions.has("ADMINISTRATOR")) return message.reply({ embeds: [embed5] })
        const embed = new Discord.MessageEmbed()
            .setAuthor({ name: `Error`, iconURL: client.gif.error })
            .setDescription(`You have to provide ID of user.\nSyntax: \`${data.prefix}ad [user ID] [reason]\``)
            .setColor("RED")
        if (!args[0]) return message.reply({ embeds: [embed] })
        else {
            try {
                const user = await client.users.fetch(args[0])
                let reason = args.slice(1).join(` `)
                await message.delete()
                const embed = new Discord.MessageEmbed()
                    .setAuthor({ name: `Short Ad`, iconURL: client.gif.error })
                    .setDescription(`Your ad in ${message.guild.name} has been deleted.\nReason: ${reason}.`)
                    .setColor(`RED`)
                const embed4 = new Discord.MessageEmbed()
                    .setAuthor({ name: `Moderation Log`, iconURL: client.gif.error })
                    .setDescription(`**Username**: ${user.tag}\n**Channel**: <#${message.channel.id}>\n**ID**: ${user.id}\n**Reason**: ${reason}`)
                    .setColor("RED")

                    let channel = message.guild.channels.cache.get(`971619282150625300`)
                    channel.send({embeds: [embed4]})            
                return user.send({ embeds: [embed]})
            } catch {
                const embed4 = new Discord.MessageEmbed()
                    .setAuthor({ name: `Error`, iconURL: client.gif.error })
                    .setDescription(`There is no user with that ID in this server`)
                    .setColor("RED")
                return message.reply({ embeds: [embed4] })
            }
        }



    }
}
