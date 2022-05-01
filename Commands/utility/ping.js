const Discord = require("discord.js");

module.exports = {
    name: "ping",
    usage: ["Get the current ping of the bot```{prefix}ping```"],
    syntax: "ping",
    enabled: true,
    aliases: [],
    category: "utility",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    //Settings for command
    nsfw: false,
    ownerOnly: false,
    cooldown: 2000,

    // Execute contains content for the command
    async execute(client, message, args, data) {
        try {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Pinging...`)
                .setColor("BLUE")
            message.channel.send({ embeds: [embed] }).then(async (m) => {
                let latencyPing = Math.floor(m.createdTimestamp - message.createdTimestamp)
                let colour = `RED`
                if (latencyPing < 5000) colour = `GREEN`
                const embed2 = new Discord.MessageEmbed()
                    .setTitle(`🏓 Pong!`)
                    .addField(`**API Latency**`, `\`${client.ws.ping}\``)
                    .addField(`**Bot Latency**`, `\`${latencyPing}\``)
                    .setColor(colour)
                m.edit({ embeds: [embed2] });
            });

        } catch (err) {
            client.logger.error(`Ran into an error while executing ${data.cmd.name}`)
            console.log(err)
            const errorembed = new Discord.MessageEmbed()
                .setAuthor({ name: `Uh Oh!`, iconURL: client.gif.error })
                .setColor(`RED`)
                .setDescription(`An issue has occured while running the command. If this error keeps occuring please contact in [support server](${client.config.supportserver})`)
            return message.channel.send({ embeds: [errorembed] });
        }
    }
}