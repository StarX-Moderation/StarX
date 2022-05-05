const Giveaway = require("../Database/Schema/Giveaway");
const Discord = require("discord.js");
const Guild = require("../Database/Schema/Guild");

module.exports = async (client, i) => {
    if (i.customId.startsWith(`Giveaway_`)) {
        if (i.customId.startsWith(`Giveaway_End_`)) {
            let m = i.customId.replace(`Giveaway_End_`, ``)
            const row2 = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setLabel(`Giveaway Link`)
                        .setStyle("LINK")
                        .setURL(`https://discord.com/channels/${m.guild}/${m.channel}/${m.id}`),
                    new Discord.MessageButton()
                        .setLabel(`Reroll`)
                        .setStyle("PRIMARY")
                        .setCustomId(`Giveaway_Reroll_${m.id}`)
                )
            const row3 = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setLabel(`Giveaway Link`)
                        .setStyle("LINK")
                        .setURL(`https://discord.com/channels/${m.guild}/${m.channel}/${m.id}`),
                )

            let e = await client.tools.endgiveaway(client, m.id)
            if (e.type === `Error`) return clearInterval(interval)
            if (e.answer === `No one`) {
                clearInterval(interval)
                i.reply({ content: `No one participated in the Giveaway for **${prize}**`, components: [row3] })
            } else {
                i.reply({ content: `Congratulations ${e.answer.join(`, `)}! You won the giveaway for **${prize}**`, components: [row2] })
                clearInterval(interval)
            }
            let gw = await Giveaway.findOne({ id: m.id })

            const embed9 = new Discord.MessageEmbed()
                .setTitle(`**${gw.prize}**`)
                .setDescription(`Giveaway Ended!\nWinners: ${e.answer === `No one` ? `No one` : e.answer.join(`, `)}\nHost: <@${message.author.id}>`)
                .setFooter({ text: `Ended at` })
                .setTimestamp(endingtime)
                .setColor(`#00ffff`)

            const button2 = new Discord.MessageButton()
                .setEmoji(emoji)
                .setStyle("PRIMARY")
                .setLabel(gw.participant.length > 0 ? gw.participant.length.toString() : '')
                .setDisabled(true)
                .setCustomId(`Giveaway_Joining_${m.id}`)

            const row = new Discord.MessageActionRow()
                .addComponents(button2)

            let message = i.channel.messages.fetch(m.id).catch(err => message = undefined)
            function sendgiveaway() {
                if (medium === `reaction`) return { content: `${client.emotes.tada} **__Giveaway Ended!__** ${client.emotes.tada}`, embeds: [embed9] }
                else {
                    return { content: `${client.emotes.tada} **__Giveaway Ended!__** ${client.emotes.tada}`, embeds: [embed9], components: [row] }
                }
            }
            message.edit(sendgiveaway())

            await Giveaway.findOneAndUpdate({ id: m.id }, { $set: { ended: true } })

        }
        if (i.customId.startsWith(`Giveaway_Entries_`)) {
            let ee = i.customId.replace(`Giveaway_Entries_`, ``)
            const guild = await Guild.findOne({ id: i.guild.id })
            const giveawayrole = guild.giveaway.roles
            if (i.member.permissions.has(`MANAGE_GUILD`) || i.member.roles.cache.find(r => giveawayrole.includes(r.id))) {
                let giveaway = await Giveaway.findOne({ id: ee.toString() })
                if (giveaway.participant.length === 0) {
                    return i.reply({ content: `There are no entries for this giveaway yet.`, ephemeral: true })
                }
                if (giveaway.participant.length <= 20) {
                    const embed3 = new Discord.MessageEmbed()
                        .setTitle(`Giveaway Entries`)
                        .setDescription(`Number of Entries: \`${giveaway.participant.length}\`\n\n**Entries**:\n${giveaway.participant.map(r => `\`${giveaway.participant.indexOf(r)}\` <@${r}>`).join(`\n`)}`)
                        .setColor(`#00ffff`)
                    return i.reply({ embeds: [embed3], ephemeral: true })
                }
                if (giveaway.participant.length > 20) {
                    function sliceIntoChunks(arr, chunkSize) {
                        const res = [];
                        for (let i = 0; i < arr.length; i += chunkSize) {
                            const chunk = arr.slice(i, i + chunkSize);
                            res.push(chunk);
                        }
                        return res;
                    }

                    let nextarrow = new Discord.MessageButton()
                        .setEmoji(client.emotes.nextarrow)
                        .setLabel(`Next`)
                        .setCustomId(`Next_Giveaway_Entries`)
                        .setStyle("PRIMARY")
                    let nextarrowdis = new Discord.MessageButton()
                        .setEmoji(client.emotes.nextarrow)
                        .setLabel(`Next`)
                        .setDisabled(true)
                        .setCustomId(`Next_Giveaway_Entries`)
                        .setStyle("PRIMARY")
                    let backarrow = new Discord.MessageButton()
                        .setEmoji(client.emotes.backarrow)
                        .setLabel(`Back`)
                        .setCustomId(`Back_Giveaway_Entries`)
                        .setStyle("PRIMARY")
                    let backarrowdis = new Discord.MessageButton()
                        .setEmoji(client.emotes.backarrow)
                        .setLabel(`Back`)
                        .setDisabled(true)
                        .setCustomId(`Back_Giveaway_Entries`)
                        .setStyle("PRIMARY")

                    const row = new Discord.MessageActionRow()
                        .addComponents(backarrowdis, nextarrow)
                    const row2 = new Discord.MessageActionRow()
                        .addComponents(backarrow, nextarrow)
                    const row3 = new Discord.MessageActionRow()
                        .addComponents(backarrow, nextarrowdis)
                    const row4 = new Discord.MessageActionRow()
                        .addComponents(backarrowdis, nextarrowdis)
                    let rr = 0
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Giveaway Entries`)
                        .setDescription(`Number of Entries: \`${giveaway.participant.length}\`\n\n**Entries**:\n${giveaway.participant.slice(0, 20).map(r => `\`${giveaway.participant.indexOf(r)+1}\` <@${r}>`).join(`\n`)}`)
                        .setColor(`#00ffff`)
                    i.reply({ embeds: [embed], components: [row], ephemeral: true }).then(r => {
                        const filter = m => m.member.id === i.member.id
                        let entriespage = sliceIntoChunks(giveaway.participant, 20)
                        const collector = i.channel.createMessageComponentCollector({ filter, idle: 10000 });
                        collector.on('collect', m => {
                            if (m.customId === `Next_Giveaway_Entries`) {
                                rr++
                                if (entriespage[rr + 1]) {
                                    const embed = new Discord.MessageEmbed()
                                        .setTitle(`Giveaway Entries`)
                                        .setDescription(`Number of Entries: \`${giveaway.participant.length}\`\n\n**Entries**:\n${entriespage[rr].map(r => `\`${giveaway.participant.indexOf(r) + 1}\` <@${r}>`).join(`\n`)}`)
                                        .setColor(`#00ffff`)

                                    return m.update({ embeds: [embed], components: [row2] })
                                }
                                if (!entriespage[rr + 1]) {
                                    const embed = new Discord.MessageEmbed()
                                        .setTitle(`Giveaway Entries`)
                                        .setDescription(`Number of Entries: \`${giveaway.participant.length}\`\n\n**Entries**:\n${entriespage[rr].map(r => `\`${giveaway.participant.indexOf(r)+1}\` <@${r}>`).join(`\n`)}`)
                                        .setColor(`#00ffff`)

                                    return m.update({ embeds: [embed], components: [row3] })

                                }
                            }
                            if (m.customId === `Back_Giveaway_Entries`) {
                                rr--
                                if (entriespage[rr - 1]) {
                                    const embed = new Discord.MessageEmbed()
                                        .setTitle(`Giveaway Entries`)
                                        .setDescription(`Number of Entries: \`${giveaway.participant.length}\`\n\n**Entries**:\n${entriespage[rr].map(r => `\`${giveaway.participant.indexOf(r)+1}\` <@${r}>`).join(`\n`)}`)
                                        .setColor(`#00ffff`)

                                    return m.update({ embeds: [embed], components: [row2] })
                                }
                                if (!entriespage[rr - 1]) {
                                    const embed = new Discord.MessageEmbed()
                                        .setTitle(`Giveaway Entries`)
                                        .setDescription(`Number of Entries: \`${giveaway.participant.length}\`\n\n**Entries**:\n${entriespage[rr].map(r => `\`${giveaway.participant.indexOf(r)+1}\` <@${r}>`).join(`\n`)}`)
                                        .setColor(`#00ffff`)

                                    return m.update({ embeds: [embed], components: [row] })

                                }
                            }

                        })

                    })
                }
            } else {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Missing Permission`)
                    .setDescription(`You need \`Manage Server\` permission or giveaway manager roles of this server to check entries of giveaways`)
                    .setColor("RED")
                return i.reply({ embeds: [embed], ephemeral: true })

            }
        }
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
                if (e.answer === `Message Deleted`) return i.reply({ embeds: [embed2], ephemeral: true })
                let giveaway = await Giveaway.findOne({ id: ee.toString() })
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

                if (e.type === `Error`) return i.reply({ content: `An error occured while reroll the giveaway`, ephemeral: true })
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
                return i.reply({ embeds: [embed], ephemeral: true })

            }
        }
        //Leave Giveaway
        if (i.customId.startsWith(`Giveaway_Leave_`)) {
            let ee = i.customId.replace(`Giveaway_Leave_`, ``)
            console.log(ee)
            let giveaway = await Giveaway.findOne({ id: ee })

            let giveawaymessage = await i.channel.messages.fetch(ee).catch(err => giveawaymessage = undefined)
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
                return i.reply({ embeds: [embed], ephemeral: true })

            } else {
                const button = new Discord.MessageButton()
                    .setEmoji(giveawaymessage.components[0].components[0].emoji)
                    .setStyle("PRIMARY")
                    .setLabel(giveaway.participant.length - 1 > 0 ? (giveaway.participant.length - 1).toString() : '')
                    .setCustomId(`Giveaway_Joining_${giveaway.id}`)
                    const endbutton = new Discord.MessageButton()
                    .setLabel(`End`)
                    .setStyle(`DANGER`)
                    .setCustomId(`Giveaway_End_${giveaway.id}`)
                const entrybutton = new Discord.MessageButton()
                    .setLabel(`Entries`)
                    .setStyle(`PRIMARY`)
                    .setCustomId(`Giveaway_Entries_${giveaway.id}`)

                const row = new Discord.MessageActionRow()
                    .addComponents(button, entrybutton, endbutton)

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
                        const endbutton = new Discord.MessageButton()
                        .setLabel(`End`)
                        .setStyle(`DANGER`)
                        .setCustomId(`Giveaway_End_${giveaway.id}`)
                    const entrybutton = new Discord.MessageButton()
                        .setLabel(`Entries`)
                        .setStyle(`PRIMARY`)
                        .setCustomId(`Giveaway_Entries_${giveaway.id}`)

                    const row2 = new Discord.MessageActionRow()
                        .addComponents(button2, entrybutton, endbutton)

                    await Giveaway.findOneAndUpdate({ id: giveaway.id }, { $push: { participant: i.member.id.toString() } }, { upsert: true })
                    i.message.edit({ components: [row2] })
                }
            }
        }
    }

}