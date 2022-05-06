const Discord = require(`discord.js`)
const Giveaway = require("../Database/Schema/Giveaway")

module.exports = async (client, reaction, user) => {
    if(user.bot) return
    const giveaway = await Giveaway.findOne({ id: reaction.message.id })
    if (giveaway) {
        let req = giveaway.requirement
        let participant = giveaway.participant
        if (participant.includes(user.id)) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Leave Giveaway`)
                .setDescription(`You have already joined this Giveaway.\nYou can click on leave button to leave.`)
                .setColor("RED")
            const button = new Discord.MessageButton()
                .setLabel("Leave")
                .setCustomId(`Giveaway_Leave_${giveaway.id}`)
                .setStyle("DANGER")
            const row = new Discord.MessageActionRow()
                .addComponents(button)

            return user.send({ embeds: [embed], components: [row] })
        } else {
            const leavebutton = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`Giveaway_Leave_${giveaway.id}`)
                        .setStyle("DANGER")
                        .setLabel(`Leave`)
                )
                let member = await reaction.message.guild.members.fetch(user)
            const reqcheck = await client.tools.giveawayreqcheck(member, req, giveaway)
            user.send({ embeds: [reqcheck.embed], components: reqcheck.bool === false ? [] : [leavebutton], ephemeral: true })
            if (reqcheck.bool === true) {

                await Giveaway.findOneAndUpdate({ id: giveaway.id }, { $push: { participant: user.id.toString() } }, { upsert: true })

            }
        }
    }
}