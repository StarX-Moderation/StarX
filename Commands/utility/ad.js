const Discord = require("discord.js")

module.exports = {

    name: "ad",
    usage: ["Log the deletion of an ad."],
    syntax: "ping",
    usage: `ad [user ID] [reason]`,
    enabled: true,
    aliases: [],
    category: "moderation",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
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
                    const Guild = require("./../../Database/Schema/Guild")
                    const guild = await Guild.findOne({id: message.guild.id})
                    let adcases = guild.adcases
                const embed4 = new Discord.MessageEmbed()
                    .setAuthor({ name: `Moderation Log`, iconURL: client.gif.error })
                    .setTitle(`Case #${adcases}`)
                    .setDescription(`**Moderator**: ${message.author.tag}\n**Username**: ${user.tag}\n**Channel**: <#${message.channel.id}>\n**ID**: ${user.id}\n**Reason**: ${reason}\n\nCheck out <#971626633918283806> for help on how to advertise.`)
                    .setColor("RED")

                    let channel = message.guild.channels.cache.get(`971619282150625300`)
                    channel.send({embeds: [embed4]})
                    await Guild.findOneAndUpdate({id: message.guild.id}, {$set: {adcases: adcases+1}})            
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
