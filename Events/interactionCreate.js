const Giveaway = require("../Database/Schema/Giveaway");
const Discord = require("discord.js")
module.exports = async (client, i) => {


    if (i.customId.startsWith(`Giveaway_`)) {
        //Reroll Giveaway
        if (i.customId.startsWith(`Giveaway_Reroll_`)) {

        }
        //Leave Giveaway
        if (i.customId.startsWith(`Giveaway_Leave_`)) {
            let ee = i.customId.replace(`Giveaway_Leave_`, ``)
            let giveaway = await Giveaway.findOne({ id: ee })

            let giveawaymessage = i.channel.messages.cache.get(giveaway.id)
            if (!giveaway || giveaway.ended === true || !giveawaymessage) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Giveaway Ended`)
                    .setDescription(`You cannot leave this giveaway now, this giveaway has ended.`)
                    .setColor("RED")
                return i.reply({ embeds: [embed], ephemeral: true })
            } else {

                const button = new Discord.MessageButton()
                    .setEmoji(giveawaymessage.components.components[0].emoji)
                    .setStyle("PRIMARY")
                    .setLabel(giveaway.participant.length - 1 > 0 ? (giveaway.participant.length - 1).toString() : '')
                    .setCustomId(`Giveaway_Joining_${giveaway.id}`)

                const row = new Discord.MessageActionRow()
                    .addComponents(button)

                await Giveaway.findOneAndUpdate({ id: ee }, { $pull: { participant: i.user.id } })
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Left Giveaway`)
                    .setDescription(`You left this giveaway, you will not be able to win this giveaway now.`)
                    .setColor("GREEN")
                giveawaymessage.edit({ components: [row] })
                return i.reply({ embeds: [embed], ephemeral: true })
            }
        }
        //Join Giveaway
        if (i.customId.startsWith(`Giveaway_Joining_`)) {
            let e = i.customId.replace(`Giveaway_Joining_`, ``)
            let giveaway = await Giveaway.findOne({ id: e })
            if (!giveaway || giveaway.ended === true) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Ended Giveaway`)
                    .setDescription(`This giveaway has ended, you cannot join this now.`)
                    .setColor("RED")
                return i.reply({ embeds: [embed], ephemeral: true })
            }
            let req = giveaway.requirement
            let participant = giveaway.participant
            if (participant.includes(i.user.id)) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Leave Giveaway`)
                    .setDescription(`You have already joined this Giveaway.\nYou can click on leave button to leave.`)
                    .setColor("RED")
                const button = new Discord.MessageButton()
                    .setLabel("Leave")
                    .setCustomId(`Giveaway_Leave_${e}`)
                    .setStyle("DANGER")
                const row = new Discord.MessageActionRow()
                    .addComponents(button)
                console.log(giveaway.participant)

                return i.reply({ embeds: [embed], components: [row], ephemeral: true })
            } else {
                const leavebutton = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId(`Giveaway_Leave_${giveaway.id}`)
                            .setStyle("DANGER")
                            .setLabel(`Leave`)
                    )
                const reqcheck = await client.tools.giveawayreqcheck(i.member, req, giveaway)
                i.reply({ embeds: [reqcheck.embed], components: reqcheck.bool === false ? [] : [leavebutton], ephemeral: true })
                if (reqcheck.bool === true) {
                    const button2 = new Discord.MessageButton()
                        .setEmoji(i.message.components[0].components[0].emoji)
                        .setStyle("PRIMARY")
                        .setLabel((giveaway.participant.length + 1).toString())
                        .setCustomId(`Giveaway_Joining_${giveaway.id}`)

                    const row2 = new Discord.MessageActionRow()
                        .addComponents(button2)

                    await Giveaway.findOneAndUpdate({ id: giveaway.id }, { $push: { participant: i.member.id.toString() } }, {upsert: true})
                    i.message.edit({ components: [row2] })
                }
            }
        }
    }

}