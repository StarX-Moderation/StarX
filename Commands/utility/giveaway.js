const Duration = require("better-ms");
const Discord = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const Giveaway = require("../../Database/Schema/Giveaway");
const Guild = require("../../Database/Schema/Guild");
var fetchUrl = require("fetch").fetchUrl;
var scraper = require('table-scraper');
var getClassesFromHtml = require("get-classes-from-html")
const fetch = require("node-fetch");

module.exports = {

    name: "giveaway",
    usage: ["Get the current ping of the bot```{prefix}ping```"],
    syntax: "ping",
    enabled: true,
    aliases: ['g'],
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

        let guild = await Guild.findOne({ id: message.guild.id })
        let medium = guild.giveaway.medium
        //No Arguement embed
        const embed = new Discord.MessageEmbed()
            .setAuthor({ name: `Syntax Error`, iconURL: client.gif.error })
            .setDescription(`You have not used the command propery, you must provide atleast one argument.\nUse \`${data.prefix}help giveaway\` get info about this command.`)
            .setColor(`RED`)
        if (!args[0]) return message.reply({ embeds: [embed] })

        //Checking for arguement
        if (args[0]) {
            //Giveaway Settings
            if (args[0] === `settings`) {
                if (!message.member.permissions.has("MANAGE_GUILD")) {
                    const embed2 = new Discord.MessageEmbed()
                        .setAuthor({ name: `Missing Permission`, iconURL: client.gif.error })
                        .setDescription(`You need \`Manage Server\` Permission to manage Giveaway setting of this server.`)
                        .setColor(`RED`)
                    return m.reply({ embeds: [embed2] })
                }
                // Select Menu
                const menu = new Discord.MessageSelectMenu()
                    .setCustomId('giveawaysetting')
                    .setPlaceholder('Select Setting to change')
                    .addOptions([
                        {
                            label: 'Emote',
                            description: 'Emote for giveaway',
                            value: 'gw_setting_emoji',
                        },
                        {
                            label: 'Manager Role',
                            description: 'Member of these roles can make giveaways.',
                            value: 'gw_setting_manager_role',
                        },
                        {
                            label: 'Always Allowed Role',
                            description: 'Member of these roles bypass every requirement in giveaways.',
                            value: 'gw_setting_always_allowed_role',
                        },
                        {
                            label: 'Blacklisted Role',
                            description: 'Member of these roles are blacklisted from joining any giveaways.',
                            value: 'gw_setting_blacklisted_role',
                        },
                        {
                            label: 'Medium of Joining Giveaways',
                            description: `Members can join giveaways by reacting on giveaway or clicking on button.`,
                            value: `gw_setting_medium`
                        },
                        {
                            label: 'Ping Role',
                            description: `Role to be pinged when --ping is used in the command.`,
                            value: `gw_setting_pingrole`
                        }

                    ])

                const menu2 = new Discord.MessageSelectMenu()
                    .setCustomId('giveawaysetting')
                    .setPlaceholder('Select to change setting')
                    .addOptions([
                        {
                            label: 'Emote',
                            description: 'Emote for giveaway',
                            value: 'gw_setting_emoji',
                        },
                        {
                            label: 'Manager Role',
                            description: 'Member of these roles can make giveaways.',
                            value: 'gw_setting_manager_role',
                        },
                        {
                            label: 'Always Allowed Role',
                            description: 'Member of these roles bypass every requirement in giveaways.',
                            value: 'gw_setting_always_allowed_role',
                        },
                        {
                            label: 'Blacklisted Role',
                            description: 'Member of these roles are blacklisted from joining any giveaways.',
                            value: 'gw_setting_blacklisted_role',
                        },
                        {
                            label: 'Medium of Joining Giveaways',
                            description: `Members can join giveaways by reacting on giveaway or clicking on button.`,
                            value: `gw_setting_medium`
                        },
                        {
                            label: 'Ping Role',
                            description: `Role to be pinged for Giveaways.`,
                            value: `gw_setting_pingrole`
                        }
                    ])




                const row = new Discord.MessageActionRow()
                    .addComponents(menu)

                const rowdisabled = new Discord.MessageActionRow()
                    .addComponents(menu2.setDisabled(true))

                async function settingembed() {
                    let guild = await Guild.findOne({ id: message.guild.id })
                    let emojidata = guild.giveaway.emote
                    let rolesdata = guild.giveaway.roles
                    let alwaysallowedrolesdata = guild.giveaway.alwaysallowedroles
                    let blacklistedrolesdata = guild.giveaway.blacklistedroles
                    let medium = guild.giveaway.medium
                    let pingroledata = guild.giveaway.pingrole

                    let emoji = client.emojis.cache.get(emojidata)
                    if (!emoji) emoji = client.emojis.cache.find(e => client.emotes.tada.includes(e.id))

                    let rolesarray = []
                    rolesdata.forEach(r => {
                        let eachrole = message.guild.roles.cache.get(r)
                        rolesarray.push(eachrole)
                    });
                    roles = rolesarray.map(r => `\`${r.name}\``).join(`, `)
                    if (!roles || roles === ``) roles = `None`

                    let alwaysallowedrolesarray = []
                    alwaysallowedrolesdata.forEach(r => {
                        let eachalwaysallowedrole = message.guild.roles.cache.get(r)
                        alwaysallowedrolesarray.push(eachalwaysallowedrole)
                    });
                    alwaysallowedroles = alwaysallowedrolesarray.map(r => `\`${r.name}\``).join(`, `)
                    if (!alwaysallowedroles || alwaysallowedroles === ``) alwaysallowedroles = `None`

                    let blacklistedrolesarray = []
                    blacklistedrolesdata.forEach(r => {
                        let eachalwaysallowedrole = message.guild.roles.cache.get(r)
                        blacklistedrolesarray.push(eachalwaysallowedrole)
                    });
                    blacklistedroles = blacklistedrolesarray.map(r => `\`${r.name}\``).join(`, `)
                    if (!blacklistedroles || blacklistedroles === ``) blacklistedroles = `None`

                    let pingrole = `<@&${pingroledata}>`
                    if (!pingroledata || pingroledata === `none`) pingrole = `None`
                    const embed2 = new Discord.MessageEmbed()
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                        .setTitle(`Giveaway Settings`)
                        .setDescription(`You can change any of these settings by choosing that setting from select menu.`)
                        .addField(`**Emote**`, `${emoji}`, true)
                        .addField(`**Manager Roles**`, `${roles}`, true)
                        .addField(`**Always Allowed Role**`, `${alwaysallowedroles}`, true)
                        .addField(`**Blacklisted Roles**`, `${blacklistedroles}`, true)
                        .addField(`**Medium of Joining**`, `${medium}`, true)
                        .addField(`**Ping Role**`, `${pingrole}`, true)
                    return embed2
                }
                return message.reply({ embeds: [await settingembed()], components: [row] }).then(async m => {

                    const filter = i => i.message.id === m.id && i.user.id === message.author.id

                    const collector = await message.channel.createMessageComponentCollector({ filter, idle: 30000 });

                    collector.on('collect', async i => {
                        let guild = await Guild.findOne({ id: message.guild.id })
                        let rolesdata = guild.giveaway.roles
                        let alwaysallowedrolesdata = guild.giveaway.alwaysallowedroles
                        let blacklistedrolesdata = guild.giveaway.blacklistedroles

                        let embed3 = new Discord.MessageEmbed()
                        if (i.values[0] === 'gw_setting_emoji') {
                            embed3 = new Discord.MessageEmbed()
                                .setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL() })
                                .setTitle(`Giveaway Setting`)
                                .setDescription(`Send new emote for giveaways of this server in the chat to change it.`)
                                .setColor("YELLOW")
                        }
                        if (i.values[0] === `gw_setting_manager_role`) {
                            embed3 = new Discord.MessageEmbed()
                                .setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL() })
                                .setTitle(`Giveaway Setting`)
                                .setDescription(`Send role which you want to add/remove as Giveaway Manager role.\nYou can send ID/Name of role or mention it.`)
                                .setColor("YELLOW")
                        }
                        if (i.values[0] === `gw_setting_always_allowed_role`) {
                            embed3 = new Discord.MessageEmbed()
                                .setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL() })
                                .setTitle(`Giveaway Setting`)
                                .setDescription(`Send role which you want to add/remove as Always allowed role.\nYou can send ID/Name of role or mention it.`)
                                .setColor("YELLOW")
                        }
                        if (i.values[0] === `gw_setting_blacklisted_role`) {
                            embed3 = new Discord.MessageEmbed()
                                .setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL() })
                                .setTitle(`Giveaway Setting`)
                                .setDescription(`Send role which you want to add/remove as blacklisted role.\nYou can send ID/Name of role or mention it.`)
                                .setColor("YELLOW")
                        }
                        if (i.values[0] === `gw_setting_medium`) {
                            embed3 = new Discord.MessageEmbed()
                                .setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL() })
                                .setTitle(`Giveaway Setting`)
                                .setDescription(`Send medium of joining giveaways for this server.\nYou can only choose between \`reaction/button\`.`)
                                .setColor("YELLOW")
                        }
                        if (i.values[0] === `gw_setting_pingrole`) {
                            embed3 = new Discord.MessageEmbed()
                                .setAuthor({ name: `${message.guild.name}`, iconURL: message.guild.iconURL() })
                                .setTitle(`Giveaway Setting`)
                                .setDescription(`Send role which you want to set as ping role for giveaways.\nYou can send ID/Name of role or mention it.`)
                                .setColor("YELLOW")
                        }
                        await i.update({ embeds: [embed3], components: [rowdisabled], allowedMentions: { repliedUser: true } }).then(async err => {
                            const filter2 = r => r.author.id === message.author.id


                            const collector2 = await message.channel.createMessageCollector({ filter2, idle: 15000, max: 5 });

                            collector2.on('collect', async msgcollect => {
                                if (msgcollect.author.id !== message.author.id) return
                                if (i.values[0] === `gw_setting_emoji`) {
                                    let requiredemoji = client.emojis.cache.find(e => msgcollect.content.includes(e.id))
                                    if (!requiredemoji) {
                                        const embed4 = new Discord.MessageEmbed()
                                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                                            .setDescription(`I cannot find that emoji.\nMake sure that the emoji is from any server where i'm present.`)
                                            .setColor("RED")
                                        return msgcollect.reply({ embeds: [embed4] })
                                    } else {
                                        const embed4 = new Discord.MessageEmbed()
                                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                                            .setTitle(`Giveaway Settings`)
                                            .setDescription(`Emoji for this server's giveaways has been changed to ${requiredemoji}`)
                                            .setColor("GREEN")
                                        collector2.stop("done")
                                        await Guild.findOneAndUpdate({ id: msgcollect.guild.id }, { $set: { "giveaway.emote": requiredemoji.id } })
                                        m.edit({ embeds: [await settingembed()], components: [row] })
                                        return msgcollect.reply({ embeds: [embed4] })
                                    }
                                }


                                if (i.values[0] === `gw_setting_pingrole`) {
                                    let requiredrole = message.guild.roles.cache.find(e => msgcollect.content.split(` `).join(``).toLowerCase().includes(e.id) || msgcollect.content.split(` `).join(``).toLowerCase().includes(e.name.split(` `).join(``).toLowerCase()))
                                    if (!requiredrole) {
                                        const embed4 = new Discord.MessageEmbed()
                                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                                            .setDescription(`I cannot find that Role.\nMake sure you have used correct role.`)
                                            .setColor("RED")
                                        return msgcollect.reply({ embeds: [embed4] })
                                    } else {
                                        const embed4 = new Discord.MessageEmbed()
                                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                                            .setTitle(`Giveaway Settings`)
                                            .setDescription(`Ping role for this server's giveaways has been changed to <@&${requiredrole.id}>.`)
                                            .setColor("GREEN")
                                        collector2.stop("done")
                                        await Guild.findOneAndUpdate({ id: msgcollect.guild.id }, { $set: { "giveaway.pingrole": requiredrole.id } })
                                        m.edit({ embeds: [await settingembed()], components: [row] })
                                        return msgcollect.reply({ embeds: [embed4] })
                                    }
                                }

                                if (i.values[0] === `gw_setting_medium`) {

                                    if (msgcollect.content.toLowerCase() !== `button` && msgcollect.content.toLowerCase() !== `reaction`) {
                                        const embed4 = new Discord.MessageEmbed()
                                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                                            .setDescription(`You can only choose between \`button/reaction\``)
                                            .setColor("RED")
                                        return msgcollect.reply({ embeds: [embed4] })
                                    } else {
                                        const embed4 = new Discord.MessageEmbed()
                                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                                            .setTitle(`Giveaway Settings`)
                                            .setDescription(`Medium for joining giveaways in this server has been changed to ${msgcollect.content.toLowerCase()}`)
                                            .setColor("GREEN")
                                        collector2.stop("done")
                                        await Guild.findOneAndUpdate({ id: msgcollect.guild.id }, { $set: { "giveaway.medium": msgcollect.content.toLowerCase() } })
                                        m.edit({ embeds: [await settingembed()], components: [row] })
                                        return msgcollect.reply({ embeds: [embed4] })
                                    }
                                }

                                if (i.values[0] === `gw_setting_manager_role`) {
                                    let requiredrole = message.guild.roles.cache.find(e => msgcollect.content.split(` `).join(``).includes(e.id || e.name.split(` `).join(``)))
                                    if (!requiredrole) {
                                        const embed4 = new Discord.MessageEmbed()
                                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                                            .setDescription(`I cannot find that Role.\nMake sure you have used correct role.`)
                                            .setColor("RED")
                                        return msgcollect.reply({ embeds: [embed4] })
                                    } else {

                                        let addremove = 'added in'
                                        if (rolesdata.includes(requiredrole.id)) {
                                            addremove = `removed from`
                                            await Guild.findOneAndUpdate({ id: msgcollect.guild.id }, { $pull: { "giveaway.roles": requiredrole.id } })
                                        } else if (!rolesdata.includes(requiredrole.id)) {
                                            await Guild.findOneAndUpdate({ id: msgcollect.guild.id }, { $push: { "giveaway.roles": requiredrole.id } })

                                        }
                                        const embed4 = new Discord.MessageEmbed()
                                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                                            .setTitle(`Giveaway Settings`)
                                            .setDescription(`<@&${requiredrole.id}> has been ${addremove} Giveaway Manager roles in this server!`)
                                            .setColor("GREEN")
                                        collector2.stop("done")
                                        m.edit({ embeds: [await settingembed()], components: [row] })
                                        return msgcollect.reply({ embeds: [embed4] })
                                    }
                                }

                                if (i.values[0] === `gw_setting_always_allowed_role`) {
                                    let requiredrole = message.guild.roles.cache.find(e => msgcollect.content.includes(e.id || e.name))
                                    if (!requiredrole) {
                                        const embed4 = new Discord.MessageEmbed()
                                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                                            .setDescription(`I cannot find that Role.\nMake sure you have used correct role.`)
                                            .setColor("RED")
                                        return msgcollect.reply({ embeds: [embed4] })
                                    } else {

                                        let addremove = 'added in'
                                        if (alwaysallowedrolesdata.includes(requiredrole.id)) {
                                            addremove = `removed from`
                                            await Guild.findOneAndUpdate({ id: msgcollect.guild.id }, { $pull: { "giveaway.alwaysallowedroles": requiredrole.id } })
                                        } else if (!alwaysallowedrolesdata.includes(requiredrole.id)) {
                                            await Guild.findOneAndUpdate({ id: msgcollect.guild.id }, { $push: { "giveaway.alwaysallowedroles": requiredrole.id } })

                                        }
                                        const embed4 = new Discord.MessageEmbed()
                                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                                            .setTitle(`Giveaway Settings`)
                                            .setDescription(`<@&${requiredrole.id}> has been ${addremove} always allowed roles in this server!`)
                                            .setColor("GREEN")
                                        collector2.stop("done")
                                        m.edit({ embeds: [await settingembed()], components: [row] })
                                        return msgcollect.reply({ embeds: [embed4] })
                                    }
                                }

                                if (i.values[0] === `gw_setting_blacklisted_role`) {
                                    let requiredrole = message.guild.roles.cache.find(e => msgcollect.content.includes(e.id || e.name))
                                    if (!requiredrole) {
                                        const embed4 = new Discord.MessageEmbed()
                                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                                            .setDescription(`I cannot find that Role.\nMake sure you have used correct role.`)
                                            .setColor("RED")
                                        return msgcollect.reply({ embeds: [embed4] })
                                    } else {

                                        let addremove = 'added in'
                                        if (blacklistedrolesdata.includes(requiredrole.id)) {
                                            addremove = `removed from`
                                            await Guild.findOneAndUpdate({ id: msgcollect.guild.id }, { $pull: { "giveaway.blacklistedroles": requiredrole.id } })
                                        } else if (!blacklistedrolesdata.includes(requiredrole.id)) {
                                            await Guild.findOneAndUpdate({ id: msgcollect.guild.id }, { $push: { "giveaway.blacklistedroles": requiredrole.id } })

                                        }
                                        const embed4 = new Discord.MessageEmbed()
                                            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                                            .setTitle(`Giveaway Settings`)
                                            .setDescription(`<@&${requiredrole.id}> has been ${addremove} blacklisted roles in this server!`)
                                            .setColor("GREEN")
                                        collector2.stop("done")
                                        m.edit({ embeds: [await settingembed()], components: [row] })
                                        return msgcollect.reply({ embeds: [embed4] })
                                    }
                                }
                            })

                            collector2.on('end', async (collected, reason) => {
                                if (reason !== "done") {
                                    const embed8 = new Discord.MessageEmbed()
                                        .setAuthor({ name: `Time's Up`, iconURL: client.gif.error })
                                        .setDescription(`You didn't respond in time. No changes were made.`)
                                        .setColor("RED")
                                    await m.edit({ embeds: [await settingembed()], components: [row] })
                                    return m.channel.send({ embeds: [embed8] })
                                }
                            })
                        })

                    });

                    collector.on('end', async (collected, reason) => {
                        if (reason !== "done") {
                            return m.edit({ embeds: [await settingembed()], components: [rowdisabled] })
                        }
                    })
                })
            }
        }
        //Settings ended here


        let managerrole = []
        if (guild.giveaway.roles) managerrole = guild.giveaway.roles

        if (!message.member.permissions.has("MANAGE_GUILD") && !message.member.roles.cache.find(r => managerrole.includes(r.id))) {
            const embed = new Discord.MessageEmbed()
                .setAuthor({ name: `Missing Permission`, iconURL: client.gif.error })
                .setDescription(`You need \`Manage Server\` permission to start giveaway.`)
                .setColor("RED")
            return message.reply({ embeds: [embed] })
        } else {
            //Ping
            if (args[0].toLowerCase() === `ping`) {
                let pingrole = guild.giveaway.pingrole === `none` || !guild.giveaway.pingrole ? `` : `<@&${guild.giveaway.pingrole}>`
                const embed2 = new Discord.MessageEmbed()
                    .setAuthor({ name: `Error`, iconURL: client.gif.error })
                    .setDescription(`This server don't have any ping role for giveaways yet.\nYou can setup it by using \`${data.prefix}giveaway settings\``)
                    .setColor("RED")
                if (!args[1] && pingrole === ``) return message.reply({ embeds: [embed2] })
                if (!args[1]) return message.channel.send(`${pingrole}`)
                let msg = args.slice(2).join(` `)
                let role = message.guild.members.cache.find(r => args[1].includes(r.id))
                if (!role) msg = args.slice(1).join(` `)
                if (msg === ``) msg = `None`


                let othermessage = ''
                if (message.guild.id === `738394656211206234`) othermessage = '\nMake sure to thank them in <#774576121500925962> <a:dz_Yayy:787569595325218817>'
                const embed = new Discord.MessageEmbed()
                    .setTitle(`**__Giveaway Time__**`)
                    .setDescription(`${role ? `**Sponsor**: <@${role.id}>\n` : ``}**Message**: ${msg}${othermessage}`)
                    .setColor(`#00ffff`)
                    .setThumbnail(client.gif.tada)
                message.delete()
                return message.channel.send({ content: pingrole, embeds: [embed] })

            }
            //List
            if (args[0].toLowerCase() === `list`) {
                const glist = await Giveaway.find({ guild: message.guild.id, ended: false })
                if (glist.length === 0) {
                    return message.reply({ content: `There are no giveaways running in this server right now.` })
                }
                if (glist.length <= 5) {
                    const embed3 = new Discord.MessageEmbed()
                        .setTitle(`Giveaways in ${message.guild.name}`)
                        .setDescription(`Number of Giveaways running right now: \`${glist.length}\``)
                        .setColor(`#00ffff`)
                    glist.forEach(r => {
                        embed3.addField(`${r.prize}`, `**Link**: [Click](https://discord.com/channels/${r.guild}/${r.channel}/${r.id})\n**ID**: ${r.id}\n**Ending Time**: <t:${Math.floor(r.endingtime / 1000)}:R> (<t:${Math.round(r.endingtime / 1000)}:F>)`)
                    })
                    return message.reply({ embeds: [embed3] })
                }
                if (glist.length > 20) {
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
                    const embed3 = new Discord.MessageEmbed()
                        .setTitle(`Giveaways in ${message.guild.name}`)
                        .setDescription(`Number of Giveaways running right now: \`${glist.length}\``)
                        .setColor(`#00ffff`)

                    glist.slice(0, 5).forEach(r => {
                        embed3.addField(`${r.prize}`, `**Link**: [Click](https://discord.com/channels/${r.guild}/${r.channel}/${r.id})\n**ID**: ${r.id}\n**Ending Time**: <t:${r.endingtime / 1000}:R> (<t:${r.endingtime / 1000}:F>)`)

                    })
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Giveaway Entries`)
                        .setDescription(`Number of Entries: \`${glist.length}\`\n\n**Entries**:\n${giveaway.participant.slice(0, 20).map(r => `\`${giveaway.participant.indexOf(r) + 1}\` <@${r}>`).join(`\n`)}`)
                        .setColor(`#00ffff`)
                    message.reply({ embeds: [embed], components: [row] }).then(r => {
                        const filter = m => m.member.id === message.member.id
                        let entriespage = sliceIntoChunks(giveaway.participant, 20)
                        const collector = r.channel.createMessageComponentCollector({ filter, idle: 10000 });
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
            }
            //List Command End here

            //Entries Command
            if (args[0].toLowerCase() === `entries`) {

                if (!args[1]) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor({ name: `Error`, iconURL: client.gif.error })
                        .setDescription(`You have to provide ID of the giveaway as well.\nSyntax: \`${data.prefix}giveaway end [giveaway ID]\``)
                        .setColor("RED")
                    return message.reply({ embeds: [embed] })
                }
                if (args[1]) {
                    const messageid = args[1]
                    const giveaway = await Giveaway.findOne({ id: messageid })
                    if (!giveaway) {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                            .setDescription(`There is no giveaway with that ID.`)
                            .setColor(`RED`)
                        return message.reply({ embeds: [embed] })
                    }
                    const guild = await Guild.findOne({ id: message.guild.id })

                    if (giveaway.participant.length === 0) {
                        return message.reply({ content: `There are no entries in that giveaway.` })
                    }
                    if (giveaway.participant.length <= 20) {
                        const embed3 = new Discord.MessageEmbed()
                            .setTitle(`Giveaway Entries`)
                            .setDescription(`Number of Entries: \`${giveaway.participant.length}\`\n\n**Entries**:\n${giveaway.participant.map(r => `\`${giveaway.participant.indexOf(r) + 1}\` <@${r}>`).join(`\n`)}`)
                            .setColor(`#00ffff`)
                        return message.reply({ embeds: [embed3] })
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
                        message.reply({ embeds: [embed], components: [row] }).then(r => {
                            const filter = m => m.member.id === message.member.id
                            let entriespage = sliceIntoChunks(giveaway.participant, 20)
                            const collector = r.channel.createMessageComponentCollector({ filter, idle: 10000 });
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
                }
            }
            //Entries Command End here

            //Start command 
            if (args[0].toLowerCase() === `start`) {

                if (!args[1] || !args[2] || !args[3] || !args[4]) {
                    const embed2 = new Discord.MessageEmbed()
                        .setAuthor({ name: `Syntax Error`, iconURL: client.gif.error })
                        .setDescription(`You have not used the command properly. You must provide ${!args[1] ? `time` : !args[2] ? `number of winners` : !args[3] ? `Requirement` : `Prize`} of giveaway\nSyntax of command is \`${data.prefix}giveaway start [time] [number of winners] [requirement] [prize]\``)
                        .setColor("RED")
                    return message.reply({ embeds: [embed2] })
                } else {
                    let time = Duration.getMilliseconds(args[1])
                    if (!time) {
                        const embed2 = new Discord.MessageEmbed()
                            .setAuthor({ name: `Syntax Error`, iconURL: client.gif.error })
                            .setDescription(`You have not used the command properly. You must provide time of giveaway properly.\nSyntax of command is \`${data.prefix}giveaway start [time] [number of winners] [requirement] [prize]\``)
                            .setColor("RED")
                        return message.reply({ embeds: [embed2] })
                    }
                    let numberofwinners = parseInt(args[2])
                    let prize = args.slice(4).join(` `)

                    const requirementarray = []

                    if (args[3].split(`;`).length > 5) {
                        const embed3 = new Discord.MessageEmbed()
                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                            .setDescription(`You cannot have more 5 requirement in a giveaway.`)
                            .setColor(`RED`)
                        return message.reply({ embeds: [embed3] })
                    }
                    for (const r of args[3].split(`;`)) {
                        let ast = r.split(`:`)
                        if (!ast[1] && ast[0].toLowerCase() !== `none`) requirementarray.push(`Error`)
                        if (ast[0].toLowerCase() === `amari` || ast[0].toLowerCase() === `amarilvl`) {

                            let guildmembers = await message.guild.members.fetch()
                            if (!guildmembers.get(`339254240012664832`)) requirementarray.push(`ErrorAmari`)
                            else {
                                if (guildmembers.get(`339254240012664832`)) {
                                    requirementarray.push({ type: `Required Amari Level`, required: parseInt(ast[1] || 0) })
                                }
                            }
                        }
                        if (ast[0].toLowerCase() === `weekly` || ast[0].toLowerCase() === `weeklyamari`) {
                            let guildmembers = await message.guild.members.fetch()

                            if (!guildmembers.get(`339254240012664832`)) requirementarray.push(`ErrorAmari`)
                            else {
                                requirementarray.push({ type: `Required Weekly Amari`, required: parseInt(ast[1] || 0) })
                            }
                        }
                        if (ast[0].toLowerCase() === `role`) {
                            const role = message.guild.roles.cache.find(r => ast[1].toLowerCase().includes(r.name.split(` `).join(``).toLowerCase()) || ast[1].toLowerCase().includes(r.id))
                            if (!role) requirementarray.push({ type: `RoleError`, answer: ast[1] })
                            else {
                                requirementarray.push({ type: `Required Role`, required: role.id })
                            }
                        }
                        if (ast[0].toLowerCase() === `bypass` || ast[0].toLowerCase() === `bypassrole`) {
                            const role = message.guild.roles.cache.find(r => ast[1].toLowerCase().includes(r.name.split(` `).join(``).toLowerCase()) || ast[1].toLowerCase().includes(r.id))
                            if (!role) requirementarray.push({ type: `RoleError`, answer: ast[1] })
                            else {
                                requirementarray.push({ type: `Bypass Role`, required: role.id })
                            }
                        }
                        if (ast[0].toLowerCase() === `blacklist` || ast[0].toLowerCase() === `blacklistrole`) {
                            const role = message.guild.roles.cache.find(r => ast[1].toLowerCase().includes(r.name.split(` `).join(``).toLowerCase()) || ast[1].toLowerCase().includes(r.id))
                            if (!role) requirementarray.push({ type: `RoleError`, answer: ast[1] })
                            else {
                                requirementarray.push({ type: `Blacklisted Role`, required: role.id })
                            }
                        }
                    }
                    let errorrole = requirementarray.find(r => r.type === `RoleError`)
                    if (errorrole) {
                        const embed5 = new Discord.MessageEmbed()
                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                            .setDescription(`I cannot find the role: \`${errorrole.answer}\`.`)
                            .setColor(`RED`)
                        return message.reply({ embeds: [embed5] })
                    }
                    if (requirementarray.includes(`ErrorAmari`)) {
                        const embed6 = new Discord.MessageEmbed()
                            .setAuthor({ name: `Amari Bot Missing`, iconURL: client.gif.error })
                            .setDescription(`You cannot make amari requirement without having Amari Bot in the server.`)
                            .setColor("RED")
                        return message.reply({ embeds: [embed6] })
                    }

                    let result = ``
                    let requirement = []

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


                    let emojidata = guild.giveaway.emote

                    let endingtime = Date.now() + time
                    let emoji = client.emojis.cache.get(emojidata)
                    if (!emoji) emoji = client.emojis.cache.find(e => client.emotes.tada.includes(e.id))
                    const embed9 = new Discord.MessageEmbed()
                        .setTitle(`**${prize}**`)
                        .setDescription(`Click on ${emoji} to participate!\nTime: ${prettyMilliseconds(time, { verbose: true, secondsDecimalDigits: 0 })}\nHost: <@${message.author.id}>${requirement.length < 1 ? `` : `\n${requirement.map(x => `${x.type}: ${x.required}`).join(`\n`)}`}`)
                        .setFooter({ text: `Winners: ${numberofwinners} | Ends at` })
                        .setTimestamp(endingtime)
                        .setColor(`#00ffff`)


                    function sendgiveaway() {
                        if (medium === `reaction`) return { content: `${client.emotes.tada} **__Giveaway!__** ${client.emotes.tada}`, embeds: [embed9] }
                        else {
                            return { content: `${client.emotes.tada} **__Giveaway!__** ${client.emotes.tada}`, embeds: [embed9] }
                        }
                    }
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
                                m.channel.send({ content: `No one participated in the Giveaway for **${prize}**`, components: [row3] })
                            } else {

                                const row = new Discord.MessageActionRow()
                                    .addComponents(
                                        new Discord.MessageButton()
                                            .setLabel(`Giveaway Link`)
                                            .setURL(`https://discord.com/channels/${m.guild.id}/${m.channel.id}/${m.id}`)
                                            .setStyle("LINK")
                                    )
                                e.answer.forEach(r => {
                                    const winneruser = client.users.cache.find(h => r.includes(h.id))
                                    let embed2 = new Discord.MessageEmbed()
                                        .setTitle(`Congratulation`)
                                        .setDescription(`You won a giveaway in ${message.guild.name}\nPrize: ${prize}`)
                                        .setColor("00ffff")

                                    winneruser.send({ embeds: [embed2], components: [row] })

                                })
                                const embed2p = new Discord.MessageEmbed()
                                    .setTitle(`Giveaway Ended`)
                                    .setDescription(`A Giveaway hosted by you has ended\nPrize: ${prize}\nWinners: ${e.answer.join(`, `)}`)
                                    .setColor("00ffff")
                                message.author.send({ embeds: [embed2p], components: [row] })
                                m.channel.send({ content: `Congratulation ${e.answer.join(`, `)}! You won the giveaway for **${prize}**`, components: [row2] })
                            }
                            const embed9 = new Discord.MessageEmbed()
                                .setTitle(`**${prize}**`)
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
                    return message.channel.send(sendgiveaway()).then(async m => {
                        await message.delete()
                        if (!m) return
                        const endbutton = new Discord.MessageButton()
                            .setLabel(`End`)
                            .setStyle(`DANGER`)
                            .setCustomId(`Giveaway_End_${m.id}`)
                        const entrybutton = new Discord.MessageButton()
                            .setLabel(`Entries`)
                            .setStyle(`PRIMARY`)
                            .setCustomId(`Giveaway_Entries_${m.id}`)


                        const button2 = new Discord.MessageButton()
                            .setEmoji(emoji)
                            .setStyle("PRIMARY")
                            .setCustomId(`Giveaway_Joining_${m.id}`)

                        const row2 = new Discord.MessageActionRow()
                            .addComponents(button2, entrybutton, endbutton)


                        if (medium === `reaction`) {
                            m.react(emoji)
                        } else {
                            m.edit({ components: [row2] })
                        }
                        let messageid = m.id
                        let remainingtime = endingtime - Date.now()

                        await Giveaway.create({ id: m.id, guild: m.guild.id, channel: m.channel.id, host: message.author.id, time: time, endingtime: endingtime, numberofwinners: numberofwinners, prize: prize, requirement: requirementarray })
                        if (remainingtime <= 10000) {
                            endinterval(remainingtime, m)
                        } else {

                            let interval = setInterval(async () => {
                                let remainingtime = endingtime - Date.now()
                                let Giveaway = require("./../../Database/Schema/Giveaway.js")
                                if (!m) {
                                    await Giveaway.findOneAndDelete({ id: messageid })
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
                                        const row = new Discord.MessageActionRow()
                                            .addComponents(
                                                new Discord.MessageButton()
                                                    .setLabel(`Giveaway Link`)
                                                    .setURL(`https://discord.com/channels/${m.guild.id}/${m.channel.id}/${m.id}`)
                                                    .setStyle("LINK")
                                            )
                                        e.answer.forEach(r => {
                                            const winneruser = client.users.cache.find(h => r.includes(h.id))
                                            let embed2 = new Discord.MessageEmbed()
                                                .setTitle(`Congratulation`)
                                                .setDescription(`You won a giveaway in ${message.guild.name}\nPrize: ${prize}`)
                                                .setColor("00ffff")

                                            winneruser.send({ embeds: [embed2], components: [row] })

                                        })
                                        const embed2p = new Discord.MessageEmbed()
                                            .setTitle(`Giveaway Ended`)
                                            .setDescription(`A Giveaway hosted by you has ended\nPrize: ${prize}\nWinners: ${e.answer.join(`, `)}`)
                                            .setColor("00ffff")
                                        message.author.send({ embeds: [embed2p], components: [row] })
                                        m.channel.send({ content: `Congratulations ${e.answer.join(`, `)}! You won the giveaway for **${prize}**`, components: [row2] })
                                    }
                                    let gw = await Giveaway.findOne({ id: m.id })

                                    const embed9 = new Discord.MessageEmbed()
                                        .setTitle(`**${prize}**`)
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

                                if (remainingtime > 0) {
                                    let gw = await Giveaway.findOne({ id: m.id })
                                    const embed9 = new Discord.MessageEmbed()
                                        .setTitle(`**${prize}**`)
                                        .setDescription(`Click on ${emoji} to participate!\nTime: ${client.tools.prettyMilliseconds(remainingtime, { verbose: true, secondsDecimalDigits: 0 })}\nHost: <@${message.author.id}>${requirement.length < 1 ? `` : `\n${requirement.map(x => `${x.type}: ${x.required}`).join(`\n`)}`}`)
                                        .setFooter({ text: `Winners: ${numberofwinners} | Ends at` })
                                        .setTimestamp(endingtime)
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
                    })
                }
            }
            //Start command end here

            if (args[0].toLowerCase() === `cancel`) {
                if (!args[1]) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor({ name: `Error`, iconURL: client.gif.error })
                        .setDescription(`You have to provide ID of the giveaway as well.\nSyntax: \`${data.prefix}giveaway end [giveaway ID]\``)
                        .setColor("RED")
                    return message.reply({ embeds: [embed] })
                }
                if (args[1]) {
                    const messageid = args[1]
                    const giveaway = await Giveaway.findOne({ id: messageid })
                    if (!giveaway) {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                            .setDescription(`There is no giveaway with that ID.`)
                            .setColor(`RED`)
                        return message.reply({ embeds: [embed] })
                    }
                    if (giveaway.ended === true) {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                            .setDescription(`That giveaway has ended already.`)
                            .setColor("RED")
                        return message.reply({ embeds: [embed] })
                    }
                    try {
                        const msg = await message.channel.messages.fetch(messageid)
                        const embed = new Discord.MessageEmbed()
                            .setAuthor({ name: `Confirm Action` })
                            .setDescription(`Are you sure? Do you want to cancel giveaway with ID \`${msg.id}\`?`)
                            .setColor("YELLOW")
                        const button = new Discord.MessageButton()
                            .setLabel(`Cancel`)
                            .setCustomId(`Giveaway_Cancel_${msg.id}`)
                            .setStyle("DANGER")
                        const row = new Discord.MessageActionRow()
                            .addComponents(button)

                        return message.reply({ embeds: [embed], components: [row] })
                    } catch {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                            .setDescription(`There is no message with that ID in this channel.`)
                        return message.reply({ embeds: [embed] })
                    }
                }
            }

            //reroll giveaway
            if (args[0].toLowerCase() === `reroll`) {
                if (!args[1]) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor({ name: `Error`, iconURL: client.gif.error })
                        .setDescription(`You have to provide ID of the giveaway as well.\nSyntax: \`${data.prefix}giveaway end [giveaway ID]\``)
                        .setColor("RED")
                    return message.reply({ embeds: [embed] })
                }
                if (args[1]) {
                    const messageid = args[1]
                    const giveaway = await Giveaway.findOne({ id: messageid })
                    if (!giveaway) {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                            .setDescription(`There is no giveaway with that ID.`)
                            .setColor(`RED`)
                        return message.reply({ embeds: [embed] })
                    }
                    if (giveaway.ended !== true) {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                            .setDescription(`That giveaway hasn't ended yet.`)
                            .setColor("RED")
                        return message.reply({ embeds: [embed] })
                    }
                    try {
                        const msg = await message.channel.messages.fetch(messageid)
                        const embed = new Discord.MessageEmbed()
                            .setAuthor({ name: `Confirm Action` })
                            .setDescription(`Are you sure? Do you want to reroll giveaway with ID \`${msg.id}\`?`)
                            .setColor("YELLOW")
                        const button = new Discord.MessageButton()
                            .setLabel(`Reroll`)
                            .setCustomId(`Giveaway_Reroll_${msg.id}`)
                            .setStyle("PRIMARY")
                        const row = new Discord.MessageActionRow()
                            .addComponents(button)

                        return message.reply({ embeds: [embed], components: [row] })
                    } catch {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                            .setDescription(`There is no message with that ID in this channel.`)
                        return message.reply({ embeds: [embed] })
                    }
                }
            }
            //end giveaway

            if (args[0].toLowerCase() === `end`) {
                if (!args[1]) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor({ name: `Error`, iconURL: client.gif.error })
                        .setDescription(`You have to provide ID of the giveaway as well.\nSyntax: \`${data.prefix}giveaway end [giveaway ID]\``)
                        .setColor("RED")
                    return message.reply({ embeds: [embed] })
                }
                if (args[1]) {
                    const messageid = args[1]
                    const giveaway = await Giveaway.findOne({ id: messageid })
                    if (!giveaway) {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                            .setDescription(`There is no giveaway with that ID.`)
                            .setColor(`RED`)
                        return message.reply({ embeds: [embed] })
                    }
                    try {
                        const msg = await message.channel.messages.fetch(messageid)
                        const embed = new Discord.MessageEmbed()
                            .setAuthor({ name: `Confirm Action` })
                            .setDescription(`Are you sure? Do you want to end Giveaway with ID \`${msg.id}\`?`)
                            .setColor("YELLOW")
                        const button = new Discord.MessageButton()
                            .setLabel(`End`)
                            .setCustomId(`Giveaway_End_${msg.id}`)
                            .setStyle("DANGER")
                        const row = new Discord.MessageActionRow()
                            .addComponents(button)

                        return message.reply({ embeds: [embed], components: [row] })
                    } catch {
                        const embed = new Discord.MessageEmbed()
                            .setAuthor({ name: `Error`, iconURL: client.gif.error })
                            .setDescription(`There is no message with that ID in this channel.`)
                        return message.reply({ embeds: [embed] })
                    }
                }
            }

        } //Else 


    }
}