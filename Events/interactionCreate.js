const Giveaway = require("../Database/Schema/Giveaway");
const Discord = require("discord.js");
const Guild = require("../Database/Schema/Guild");
module.exports = async (client, i) => {


    if (i.customId.startsWith(`Giveaway_`)) {
        //Reroll Giveaway
        if (i.customId.startsWith(`Giveaway_Reroll_`)) {
            let ee = i.customId.replace(`Giveaway_Reroll_`, ``)
            const guild = await Guild.findOne({ id: i.guild.id })
            const giveawayrole = guild.giveaway.roles
            if (i.member.permissions.has(`MANAGE_GUILD`) || i.member.roles.cache.find(r => giveawayrole.includes(r.id))) {
                let embed2 = new Discord.MessageEmbed()
                .setTitle(`Giveaway Deleted`)
                .setDescription(`That Giveaway has been deleted, You cannot reroll it now`)
                .setColor("RED")

                let e = await client.tools.endgiveaway(client, ee.toString())
                if(e.answer === `Message Deleted`) return i.reply({embeds: [embed2], ephemeral: true})
                let giveaway = await Giveaway.findOne({id: ee.toString()})
                const row2 = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setLabel(`Giveaway Link`)
                        .setStyle("LINK")
                        .setURL(`https://discord.com/channels/${giveaway.guild}/${giveaway.channel}/${giveaway.id}`),
                    new Discord.MessageButton()
                        .setLabel(`Reroll`)
                        .setStyle("PRIMARY")
                        .setCustomId(`Giveaway_Reroll_${ee.toString()}`)
                )

                if (e.type === `Error`) return i.reply({content: `An error occured while reroll the giveaway`, ephemeral: true})
                if (e.answer === `No one`) {
                    i.reply({ content: `No one participated in the Giveaway for **${prize}**`, components: [row2] })
                } else {
                    i.reply({ content: `Congratulations ${e.answer.join(`, `)}! You won the reroll of giveaway for **${giveaway.prize}**`, components: [row2] })
                }
            } else {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Missing Permission`)
                    .setDescription(`You need \`Manage Server\` permission or giveaway manager roles of this server to reroll giveaways`)
                    .setColor("RED")
                return i.reply({ embeds: [embed] , ephemeral: true})

            }
        }
        //Leave Giveaway
        if (i.customId.startsWith(`Giveaway_Leave_`)) {
            let ee = i.customId.replace(`Giveaway_Leave_`, ``)
            console.log(ee)
            let giveaway = await Giveaway.findOne({ id: ee })

            let channelmessage = await i.channel.messages.fetch()
            let giveawaymessage = channelmessage.find(r => r.id === ee.toString())
            if (!giveaway || giveaway.ended === true || !giveawaymessage) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Giveaway Ended`)
                    .setDescription(`You cannot leave this giveaway now, this giveaway has ended.`)
                    .setColor("RED")
                return i.reply({ embeds: [embed], ephemeral: true })
            }
            if (!giveaway.participant.includes(i.member.id)) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`You have not joined this giveaway`)
                    .setDescription(`You cannot leave a giveaway which you haven't joined`)
                    .setColor("RED")
                return i.reply({ embeds: [embed] })

            } else {
                const button = new Discord.MessageButton()
                    .setEmoji(giveawaymessage.components[0].components[0].emoji)
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

                    await Giveaway.findOneAndUpdate({ id: giveaway.id }, { $push: { participant: i.member.id.toString() } }, { upsert: true })
                    i.message.edit({ components: [row2] })
                }
            }
        }
    }

}