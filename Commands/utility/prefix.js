const Discord = require("discord.js");
const Guild = require("../../Database/Schema/Guild");

module.exports = {
    name: "prefix",
    usage: ["Change Prefix of bot in the server."],
    syntax: "prefix [new prefix]",
    enabled: true,
    aliases: [],
    category: "utility",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 20000,

    // Execute contains content for the command
    async execute(client, message, args, data) {
        let guild = await Guild.findOne({ id: message.guild.id })
        if (!guild) {
            await Guild.create({ id: message.guild.id })
            guild = await Guild.findOne({ id: message.guild.id })
        }
        try {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Prefix`)
                .setDescription(`Current prefix in this server is \`${guild.prefix}\`.\nYou can use \`${guild.prefix}prefix [new prefix]\` to change it!`)
                .setColor(`#00FFFF`)
            if (!args[0]) {
                return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } })
            } else {
                if (args[0]) {
                    if (!message.member.permissions.has('MANAGE_GUILD')) {
                        const embed7 = new Discord.MessageEmbed()
                            .setAuthor({ name: `Permission Missing`, iconURL: client.gif.error })
                            .setDescription(`You need \`Manage Server\` permission to change prefix.`)
                            .setColor(`RED`)
                        return message.reply({ embeds: [embed7] })
                    }
                    if (args[0].length > 5) {
                        const embed2 = new Discord.MessageEmbed()
                            .setAuthor({ name: `Error`, iconURL: client.logger.error })
                            .setColor("RED")
                            .setDescription(`Prefix must have less than 5 characters.`)
                        return message.reply({ embeds: [embed2] })
                    } else {
                        const embed3 = new Discord.MessageEmbed()
                            .setAuthor({ name: `Confirm Action`, iconURL: client.gif.yellowdot })
                            .setDescription(`Are you sure? Do you want to change prefix of this server to \`${args[0]}\`?`)
                            .setColor(`YELLOW`)

                        const tickbutton = new Discord.MessageButton()
                            .setEmoji(client.emotes.tick)
                            .setCustomId('PrefixChangeTick')
                            .setStyle('SUCCESS')

                        const crossbutton = new Discord.MessageButton()
                            .setEmoji(client.emotes.cross)
                            .setCustomId('PrefixChangeCross')
                            .setStyle('DANGER')

                        const row = new Discord.MessageActionRow()
                            .addComponents(tickbutton, crossbutton)

                        return message.reply({ embeds: [embed3], components: [row] }).then(m => {
                            const filter = i => i.message.id === m.id && i.user.id === message.author.id

                            const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });

                            collector.on('collect', async i => {
                                if (i.customId === 'PrefixChangeTick') {
                                    await Guild.findOneAndUpdate({ id: message.guild.id }, { prefix: args[0] }).catch(err => {
                                        return console.log(err)
                                    })
                                    const embed4 = new Discord.MessageEmbed()
                                        .setAuthor({ name: `Action Confirmed`, iconURL: client.gif.success })
                                        .setDescription(`Successfully changed prefix of this server to \`${args[0]}\`.`)
                                        .setColor("GREEN")
                                    await i.update({ embeds: [embed4], components: [], allowedMentions: { repliedUser: true } });
                                    collector.stop("done")
                                }
                                if (i.customId === `PrefixChangeCross`) {
                                    const embed5 = new Discord.MessageEmbed()
                                        .setAuthor({ name: `Action Cancelled`, iconURL: client.gif.error })
                                        .setDescription(`Prefix in this server has not changed.`)
                                        .setColor("RED")
                                    await i.update({ embeds: [embed5], components: [] })
                                    collector.stop("done")
                                }
                            });

                            collector.on('end', (collected, reason) => {
                                if (reason !== "done") {
                                    const embed6 = new Discord.MessageEmbed()
                                        .setAuthor({ name: `Action Cancelled`, iconURL: client.gif.error })
                                        .setDescription(`You didn't respond in time, Prefix has not changed.`)
                                        .setColor("RED")
                                    return m.edit({ embeds: [embed6], components: [] })
                                }
                            })


                        })
                    }
                }
            }
        } catch (err) {
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `Uh Oh!`, iconURL: client.gif.error })
                .setColor(`RED`)
                .setDescription(`An issue has occured while running the command. If this error keeps occuring please contact in [support server](${client.config.supportserver})`)
            return message.reply({ embeds: [errorembed] })
        }


    }
}