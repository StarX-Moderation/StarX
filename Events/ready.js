const db = require(`quick.db`);
const Giveaway = require("../Database/Schema/Giveaway");
const Guild = require("../Database/Schema/Guild");
const Discord = require("discord.js")
module.exports = async(client) => {
    client.logger.ready(`Logged in as ${client.user.tag}!`)
    client.user.setPresence({ activity: { name: 'for a!help', type: "WATCHING" }, status: "online" });


    let giveaways = await Giveaway.find({ended: false})
    giveaways.forEach(async g => {
        let guild = client.guilds.cache.get(g.guild)
        if(!guild) {await Giveaway.findOneAndDelete({id: g.id}); return}
        let channel = guild.channels.cache.get(g.channel)
        if(!channel) {await Giveaway.findOneAndDelete({id: g.id}); return}
        try{
            let guilddata = await Guild.findOne({id: guild.id})
            let medium = guilddata.giveaway.medium
            let emoji = client.emojis.cache.get(guilddata.giveaway.emote)
            if (!emoji) emoji = client.emojis.cache.find(e => client.emotes.tada.includes(e.id))

            let remainingtime = g.endingtime-Date.now()
            async function endinterval(remainingtime, m) {
                setTimeout(async () => {
                    let gw = await Giveaway.findOne({ id: m.id })
                    if (!gw) return
                    const row2 = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setLabel(`Giveaway Link`)
                                .setStyle("LINK")
                                .setURL(`https://discord.com/channels/${m.guild.id}/${m.channel.id}/${m.id}`),
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
                                .setURL(`https://discord.com/channels/${m.guild.id}/${m.channel.id}/${m.id}`),
                        )
                    let e = await client.tools.endgiveaway(client, m.id, m).catch(err => console.log(err))
                    if (e.type === `Error`) return
                    if (e.answer === `No one`) {
                        m.channel.send({ content: `No one participated in the Giveaway for **${g.prize}**`, components: [row3] })
                    } else {
                        m.channel.send({ content: `Congratulations ${e.answer.join(`, `)}! You won the giveaway for **${g.prize}**`, components: [row2] })
                    }
                    const embed9 = new Discord.MessageEmbed()
                        .setTitle(`**${g.prize}**`)
                        .setDescription(`Giveaway Ended!\nWinners: ${e.answer === `No one` ? `No one` : e.answer.join(`, `)}\nHost: <@${g.host}>`)
                        .setFooter({ text: `Ended at` })
                        .setTimestamp(g.endingtime)
                        .setColor(`#00ffff`)
                    const button2 = new Discord.MessageButton()
                        .setEmoji(emoji)
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



                    function sendgiveaway() {
                        if (medium === `reaction`) return { content: `${client.emotes.tada} **__Giveaway Ended!__** ${client.emotes.tada}`, embeds: [embed9] }
                        else {
                            return { content: `${client.emotes.tada} **__Giveaway Ended!__** ${client.emotes.tada}`, embeds: [embed9], components: [row] }
                        }
                    }

                    m.edit(sendgiveaway())
                    await Giveaway.findOneAndUpdate({ id: m.id }, { $set: { ended: true } })

                }, remainingtime);


            }
            let m = await channel.messages.fetch(g.id)    
            if (remainingtime <= 10000) {
                endinterval(remainingtime, m)
            } else {    
        let interval = setInterval(async () => {
            let remainingtime = g.endingtime - Date.now()
            if (!m) {
                await Giveaway.findOneAndDelete({ id: g.id })
                return clearInterval(interval)
            }
            let gw = await Giveaway.findOne({ id: m.id })

            if (!gw) return clearInterval(interval)
            if (gw.ended === true) {
                return clearInterval(interval)
            }
            if (remainingtime <= 0) {

                const row2 = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setLabel(`Giveaway Link`)
                            .setStyle("LINK")
                            .setURL(`https://discord.com/channels/${m.guild.id}/${m.channel.id}/${m.id}`),
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
                            .setURL(`https://discord.com/channels/${m.guild.id}/${m.channel.id}/${m.id}`),
                    )

                let e = await client.tools.endgiveaway(client, m.id, m).catch(err => console.log(err))
                if (e.type === `Error`) return clearInterval(interval)
                if (e.answer === `No one`) {
                    m.channel.send({ content: `No one participated in the Giveaway for **${prize}**`, components: [row3] })
                } else {
                    m.channel.send({ content: `Congratulations ${e.answer.join(`, `)}! You won the giveaway for **${prize}**`, components: [row2] })
                }
                let gw = await Giveaway.findOne({ id: m.id })

                const embed9 = new Discord.MessageEmbed()
                    .setTitle(`**${prize}**`)
                    .setDescription(`Giveaway Ended!\nWinners: ${e.answer === `No one` ? `No one` : e.answer.join(`, `)}\nHost: <@${g.host}>`)
                    .setFooter({ text: `Ended at` })
                    .setTimestamp(endingtime)
                    .setColor(`#00ffff`)

                const button2 = new Discord.MessageButton()
                    .setEmoji(emoji)
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


                function sendgiveaway() {
                    if (medium === `reaction`) return { content: `${client.emotes.tada} **__Giveaway Ended!__** ${client.emotes.tada}`, embeds: [embed9] }
                    else {
                        return { content: `${client.emotes.tada} **__Giveaway Ended!__** ${client.emotes.tada}`, embeds: [embed9], components: [row] }
                    }
                }
                m.edit(sendgiveaway())
                await Giveaway.findOneAndUpdate({ id: m.id }, { $set: { ended: true } })
                clearInterval(interval)

            }
            if (remainingtime <= 10000) {
                endinterval(remainingtime, m)
                clearInterval(interval)

            }
            let requirement = []
            let requirementarray = g.requirement
            let requirementtype = requirementarray.map(x => x.type).filter(function (item, pos, self) {
                return self.indexOf(item) == pos;
            });

            for (let i = 0; i < requirementtype.length; i++) {
                let requirementobj = requirementtype[i];
                let commands = ``
                if (requirementobj === `Required Role` || requirementobj === `Bypass Role` || requirementobj === `Blacklisted Role`) {
                    commands = requirementarray.filter(x => x.type === requirementobj).map(x => `<@&${x.required}>`);
                } else {
                    commands = requirementarray.filter(x => x.type === requirementobj).map(x => x.required)
                }
                let cmdText = commands.length < 1 ? "" : commands.join(", ");
                let obj = {
                    type: requirementobj,
                    required: `${cmdText}`
                }
                requirement.push(obj)
            }

            if (remainingtime > 0) {
                let gw = await Giveaway.findOne({ id: m.id })
                const embed9 = new Discord.MessageEmbed()
                    .setTitle(`**${gw.prize}**`)
                    .setDescription(`Click on ${emoji} to participate!\nTime: ${client.tools.prettyMilliseconds(remainingtime, { verbose: true, secondsDecimalDigits: 0 })}\nHost: <@${g.host}>${requirement.length < 1 ? `` : `\n${requirement.map(x => `${x.type}: ${x.required}`).join(`\n`)}`}`)
                    .setFooter({ text: `Winners: ${gw.numberofwinners} | Ends at` })
                    .setTimestamp(gw.endingtime)
                    .setColor(`#00ffff`)

                const button = new Discord.MessageButton()
                    .setEmoji(emoji)
                    .setStyle("PRIMARY")
                    .setLabel(gw.participant.length > 0 ? gw.participant.length.toString() : '')
                    .setCustomId(`Giveaway_Joining_${m.id}`)
                const endbutton = new Discord.MessageButton()
                    .setLabel(`End`)
                    .setStyle(`DANGER`)
                    .setCustomId(`Giveaway_End_${m.id}`)
                const entrybutton = new Discord.MessageButton()
                    .setLabel(`Entries`)
                    .setStyle(`PRIMARY`)
                    .setCustomId(`Giveaway_Entries_${m.id}`)

                const row = new Discord.MessageActionRow()
                    .addComponents(button, entrybutton, endbutton)


                function sendgiveaway() {
                    if (medium === `reaction`) return { embeds: [embed9] }
                    else {
                        return { embeds: [embed9], components: [row] }
                    }
                }
                m.edit(sendgiveaway())
            }
        }, 10000);
    }
    }catch{

    }
    })
}