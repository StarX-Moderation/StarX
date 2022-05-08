const Giveaway = require("../Database/Schema/Giveaway");
const Discord = require("discord.js");
const Guild = require("../Database/Schema/Guild");
const { Modal, TextInputComponent, showModal } = require("discord-modals");

module.exports = async (client, i) => {
    if(i.customId.startsWith(`apply_`)){
        if(i.customId === `apply_gfx_designer`){
            const modal = new Modal()
            .setTitle(`Apply for Staff`)
            .setCustomId(`modal_apply_gfx_designer`)
            .addComponents(
                new TextInputComponent()
                .setCustomId(`modal_apply_gfx_designer_question1`)
                .setLabel(`What is your age?`)
                .setPlaceholder(`Write your answer`)
                .setRequired(true)
                .setMaxLength(20)
                .setStyle("SHORT"),
                new TextInputComponent()
                .setCustomId(`modal_apply_gfx_designer_question2`)
                .setLabel(`Have you worked in any other server before?`)
                .setPlaceholder(`Write your answer`)
                .setRequired(true)
                .setMaxLength(200)
                .setStyle("SHORT"),
                new TextInputComponent()
                .setCustomId(`modal_apply_gfx_designer_question3`)
                .setLabel(`Which softwares do you use for deisgning?`)
                .setMaxLength(100)
                .setPlaceholder(`Write your answer`)
                .setRequired(true)
                .setStyle("SHORT"),
                new TextInputComponent()
                .setCustomId(`modal_apply_gfx_designer_question4`)
                .setLabel(`Anything else you would like to tell?`)
                .setMaxLength(400)
                .setPlaceholder(`Write your answer`)
                .setRequired(false)
                .setStyle("SHORT"),
            )
            showModal(modal, {client, client, interaction: i})
        }

        if(i.customId === `apply_developer`){
            const modal = new Modal()
            .setTitle(`Apply for Staff`)
            .setCustomId("modal_apply_developer")
            .addComponents(
                new TextInputComponent()
                .setCustomId(`modal_apply_developer_question1`)
                .setLabel(`What is your age?`)
                .setPlaceholder(`Write your answer`)
                .setRequired(true)
                .setMaxLength(20)
                .setStyle("SHORT"),
                new TextInputComponent()
                .setCustomId(`modal_apply_developer_question2`)
                .setLabel(`Have you worked in any other server before??`)
                .setPlaceholder(`Write your answer`)
                .setRequired(true)
                .setMaxLength(200)
                .setStyle("SHORT"),
                new TextInputComponent()
                .setCustomId(`modal_apply_developer_question3`)
                .setLabel(`Which software do you use for coding?`)
                .setMaxLength(100)
                .setPlaceholder(`Write your answer`)
                .setRequired(true)
                .setStyle("SHORT"),
                new TextInputComponent()
                .setCustomId(`modal_apply_developer_question4`)
                .setLabel(`In which languages do you code?`)
                .setMaxLength(100)
                .setPlaceholder(`Write your answer`)
                .setRequired(true)
                .setStyle("SHORT"),
                new TextInputComponent()
                .setCustomId(`modal_apply_developer_question5`)
                .setLabel(`Anything else you would like to tell?`)
                .setPlaceholder(`Write your answer`)
                .setRequired(false)
                .setMaxLength(300)
                .setStyle("SHORT"),
            )
            showModal(modal, {client, client, interaction: i})
        }

    }
    if (i.customId.startsWith(`Giveaway_`)) {
        if(!i.customId.startsWith(`Giveaway_Joining_`)&&!i.customId.startsWith(`Giveaway_Leave_`)){
            const guild = await Guild.findOne({id: i.guild.id})
            if(guild){
                const roles = guild.giveaway.roles
                let role = roles.find(r => i.member.roles.cache.has(r))
                if(!role && !i.member.permissions.has(`MANAGE_GUILD`)){
                    return i.reply({content: `You dont have permission for doing this action.`, ephemeral: true})
                }
            }
        }
        //Cancel Giveaway
        if (i.customId.startsWith(`Giveaway_Cancel_`)) {
            const guild = await Guild.findOne({ id: i.guild.id })
            const giveawayrole = guild.giveaway.roles

            if (i.member.permissions.has(`MANAGE_GUILD`) || i.member.roles.cache.find(r => giveawayrole.includes(r.id))) {

                let rr = i.customId.replace(`Giveaway_Cancel_`, ``)
                let m = await Giveaway.findOne({ id: rr })

                let gw = m
                const embed2 = new Discord.MessageEmbed()
                    .setTitle(`Error`)
                    .setDescription(`Cannot find that giveaway.`)
                    .setColor("RED")
                if (!gw) return i.reply({ embeds: [embed2], ephemeral: true })
                const embed9 = new Discord.MessageEmbed()
                    .setTitle(`**${gw.prize}**`)
                    .setDescription(`Giveaway Cancelled!\nHost: <@${m.host}>`)
                    .setFooter({ text: `Cancelled at` })
                    .setTimestamp(Date.now())
                    .setColor(`#00ffff`)

                let message = await i.channel.messages.fetch(m.id).catch(err => message = undefined)
                const button2 = new Discord.MessageButton()
                    .setEmoji(message.components[0].components[0].emoji)
                    .setStyle("PRIMARY")
                    .setLabel(gw.participant.length > 0 ? gw.participant.length.toString() : '')
                    .setDisabled(true)
                    .setCustomId(`Giveaway_Joining_${m.id}`)

                const row = new Discord.MessageActionRow()
                    .addComponents(button2)
                let guild = await Guild.findOne({ id: i.guild.id })
                let medium = guild.giveaway.medium

                function sendgiveaway() {
                    if (medium === `reaction`) return { content: `${client.emotes.tada} **__Giveaway Cancelled!__** ${client.emotes.tada}`, embeds: [embed9] }
                    else {
                        return { content: `${client.emotes.tada} **__Giveaway Cancelled!__** ${client.emotes.tada}`, embeds: [embed9], components: [row] }
                    }
                }
                message.edit(sendgiveaway())
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Giveaway Cancelled`)
                    .setDescription(`The giveaway for prize: ${gw.prize} has been cancelled`)
                    .setColor("RED")
                i.reply({ embeds: [embed], ephemeral: true })
                await Giveaway.findOneAndDelete({ id: m.id })
            } else {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Missing Permission`)
                    .setDescription(`You need \`Manage Server\` permission or giveaway manager roles of this server to check entries of giveaways`)
                    .setColor("RED")
                return i.reply({ embeds: [embed], ephemeral: true })

            }
        }


        if (i.customId.startsWith(`Giveaway_End_`)) {
            const guild = await Guild.findOne({ id: i.guild.id })
            const giveawayrole = guild.giveaway.roles

            if (i.member.permissions.has(`MANAGE_GUILD`) || i.member.roles.cache.find(r => giveawayrole.includes(r.id))) {

                let rr = i.customId.replace(`Giveaway_End_`, ``)
                let m = await Giveaway.findOne({ id: rr })
                if (!m) return
                if (m.ended === true) {
                    const embed10 = new Discord.MessageEmbed()
                        .setTitle(`Error`)
                        .setColor("00ffff")
                        .setDescription(`This giveaway has ended already`)
                    return i.reply({ embeds: [embed10] })
                }
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
                if (e.type === `Error`) return
                if (e.answer === `No one`) {
                    i.reply({ content: `No one participated in the Giveaway for **${m.prize}**`, components: [row3] })
                } else {
                    const row = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setLabel(`Giveaway Link`)
                                .setURL(`https://discord.com/channels/${m.guild}/${m.channel}/${m}`)
                                .setStyle("LINK")
                        )

                    e.answer.forEach(r => {
                        const winneruser = client.users.cache.find(h => r.includes(h.id))
                        let embed2 = new Discord.MessageEmbed()
                            .setTitle(`Congratulation`)
                            .setDescription(`You won a giveaway in ${i.guild.name}\nPrize: ${m.prize}`)
                            .setColor("00ffff")

                        winneruser.send({ embeds: [embed2], components: [row] })

                    })
                    const embed2p = new Discord.MessageEmbed()
                        .setTitle(`Giveaway Ended`)
                        .setDescription(`A Giveaway hosted by you has ended\nPrize: ${m.prize}\nWinners: ${e.answer.join(`, `)}`)
                        .setColor("00ffff")
                    i.reply({ content: `Congratulations ${e.answer.join(`, `)}! You won the giveaway for **${m.prize}**`, components: [row2] })

                    let host = await client.users.fetch(m.host)
                    if (host) host.send({ embeds: [embed2p], components: [row] })

                }
                let gw = await Giveaway.findOne({ id: m.id })

                const embed9 = new Discord.MessageEmbed()
                    .setTitle(`**${gw.prize}**`)
                    .setDescription(`Giveaway Ended!\nWinners: ${e.answer === `No one` ? `No one` : e.answer.join(`, `)}\nHost: <@${m.host}>`)
                    .setFooter({ text: `Ended at` })
                    .setTimestamp(m.endingtime)
                    .setColor(`#00ffff`)

                let message = await i.channel.messages.fetch(m.id).catch(err => message = undefined)
                const button2 = new Discord.MessageButton()
                    .setEmoji(message.components[0].components[0].emoji)
                    .setStyle("PRIMARY")
                    .setLabel(gw.participant.length > 0 ? gw.participant.length.toString() : '')
                    .setDisabled(true)
                    .setCustomId(`Giveaway_Joining_${m.id}`)
                const button3 = new Discord.MessageButton()
                    .setLabel(`Entries`)
                    .setStyle("PRIMARY")
                    .setCustomId(`Giveaway_Entries_${m.id}`)
                const row = new Discord.MessageActionRow()
                    .addComponents(button2, button3)
                let guild = await Guild.findOne({ id: i.guild.id })
                let medium = guild.giveaway.medium

                function sendgiveaway() {
                    if (medium === `reaction`) return { content: `${client.emotes.tada} **__Giveaway Ended!__** ${client.emotes.tada}`, embeds: [embed9] }
                    else {
                        return { content: `${client.emotes.tada} **__Giveaway Ended!__** ${client.emotes.tada}`, embeds: [embed9], components: [row] }
                    }
                }
                message.edit(sendgiveaway())

                await Giveaway.findOneAndUpdate({ id: m.id }, { $set: { ended: true } })

            } else {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Missing Permission`)
                    .setDescription(`You need \`Manage Server\` permission or giveaway manager roles of this server to check entries of giveaways`)
                    .setColor("RED")
                return i.reply({ embeds: [embed], ephemeral: true })

            }
        }
        //Entries of Giveaway
        if (i.customId.startsWith(`Giveaway_Entries_`)) {
            let ee = i.customId.replace(`Giveaway_Entries_`, ``)
            const guild = await Guild.findOne({ id: i.guild.id })
            const giveawayrole = guild.giveaway.roles
            if (i.member.permissions.has(`MANAGE_GUILD`) || i.member.roles.cache.find(r => giveawayrole.includes(r.id))) {
                let giveaway = await Giveaway.findOne({ id: ee.toString() })
                if (giveaway.participant.length === 0) {
                    return i.reply({ content: `There are no entries in this giveaway.`, ephemeral: true })
                }
                if (giveaway.participant.length <= 20) {
                    const embed3 = new Discord.MessageEmbed()
                        .setTitle(`Giveaway Entries`)
                        .setDescription(`Number of Entries: \`${giveaway.participant.length}\`\n\n**Entries**:\n${giveaway.participant.map(r => `\`${giveaway.participant.indexOf(r) + 1}\` <@${r}>`).join(`\n`)}`)
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
                        .setDescription(`Number of Entries: \`${giveaway.participant.length}\`\n\n**Entries**:\n${giveaway.participant.slice(0, 20).map(r => `\`${giveaway.participant.indexOf(r) + 1}\` <@${r}>`).join(`\n`)}`)
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
                                        .setDescription(`Number of Entries: \`${giveaway.participant.length}\`\n\n**Entries**:\n${entriespage[rr].map(r => `\`${giveaway.participant.indexOf(r) + 1}\` <@${r}>`).join(`\n`)}`)
                                        .setColor(`#00ffff`)

                                    return m.update({ embeds: [embed], components: [row3] })

                                }
                            }
                            if (m.customId === `Back_Giveaway_Entries`) {
                                rr--
                                if (entriespage[rr - 1]) {
                                    const embed = new Discord.MessageEmbed()
                                        .setTitle(`Giveaway Entries`)
                                        .setDescription(`Number of Entries: \`${giveaway.participant.length}\`\n\n**Entries**:\n${entriespage[rr].map(r => `\`${giveaway.participant.indexOf(r) + 1}\` <@${r}>`).join(`\n`)}`)
                                        .setColor(`#00ffff`)

                                    return m.update({ embeds: [embed], components: [row2] })
                                }
                                if (!entriespage[rr - 1]) {
                                    const embed = new Discord.MessageEmbed()
                                        .setTitle(`Giveaway Entries`)
                                        .setDescription(`Number of Entries: \`${giveaway.participant.length}\`\n\n**Entries**:\n${entriespage[rr].map(r => `\`${giveaway.participant.indexOf(r) + 1}\` <@${r}>`).join(`\n`)}`)
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
                    i.reply({ content: `No one participated in the Giveaway for **${giveaway.prize}**`, components: [row2] })
                } else {
                    let m = giveaway
                    const row = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setLabel(`Giveaway Link`)
                                .setURL(`https://discord.com/channels/${m.guild}/${m.channel}/${m}`)
                                .setStyle("LINK")
                        )

                    e.answer.forEach(r => {
                        const winneruser = client.users.cache.find(h => r.includes(h.id))
                        let embed2 = new Discord.MessageEmbed()
                            .setTitle(`Congratulation`)
                            .setDescription(`You won a giveaway in ${i.guild.name}\nPrize: ${m.prize}`)
                            .setColor("00ffff")

                        winneruser.send({ embeds: [embed2], components: [row] })

                    })
                    const embed2p = new Discord.MessageEmbed()
                        .setTitle(`Giveaway Ended`)
                        .setDescription(`A Giveaway hosted by you has ended\nPrize: ${m.prize}\nWinners: ${e.answer.join(`, `)}`)
                        .setColor("00ffff")

                    let host = await client.users.fetch(m.host)
                    if (host) host.send({ embeds: [embed2p], components: [row] })

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

                await Giveaway.findOneAndUpdate({ id: ee }, { $pull: { participant: i.user.id } })
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Left Giveaway`)
                    .setDescription(`You left this giveaway, you will not be able to win this giveaway now.`)
                    .setColor("GREEN")
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

                    await Giveaway.findOneAndUpdate({ id: giveaway.id }, { $push: { participant: i.member.id.toString() } }, { upsert: true })
                }
            }
        }
    }

}