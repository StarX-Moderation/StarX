const Discord = require("discord.js");
const moment = require(`moment`);
const Guild = require("../../Database/Schema/Guild");
module.exports = {
    //Command Information
    name: "appeal",
    description: "Appeal for ban for a server.",
    usage: "appeal",
    enabled: true,
    aliases: ["None"],
    category: "server",
    subcategory: "Ban Appeal",
    memberPermissions: [],
    memberp:[`None`],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS" ],
    botp: ["Send Messages, Embed Links"],
    nsfw: false,
    cooldown: 0,
    ownerOnly: false,

    async execute(client, message, args) {
        if(message.guild.id !== `972386188189106206`){
            return message.reply(`You cannot appeal in this server.`)
        }
        if(message.channel.id !== `972392312871198750`){
            return message.reply(`You can appeal in <#848175916555305000>`)
        }

        message.react(client.emotes.tick)
            const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
            .setTitle(`**__Ban Appeal__**`)
            .setDescription(`Send ID of server for which You want to appeal ban.`)
            .setColor(`RED`)
            let msg = await message.author.send({embeds: [embed]})
            let channel = msg.channel
            let filter = r => r.author.id === message.author.id
            const collector = channel.createMessageCollector({filter, time: 100000, max: 5})
            collector.on('collect', async msg => {
                const guild = client.guilds.cache.find(x => x.id === msg.content)
                if(!guild) return channel.send(`You have to provide a valid Guild ID.`)
                const guildid = await Guild.findOne({id: guild.id})
                if(!guildid.appeal) return channel.send(`That server have not enabled Appeal in AutoMaton.`)
                if(guildid.appeal.enabled !== true) return channel.send(`That server have not enabled Appeal in AutoMaton.`)
                let e = undefined
                try {
                    e = await guild.bans.fetch(message.author)
                } catch {
                    return channel.send(`You are not banned in ${guild.name}`)
                }
                if(!e) return channel.send(`You are not banned in ${guild.name}`)
                else {
                    collector.stop("ending")
                    const embed = new Discord.MessageEmbed()
                    .setAuthor(message.guild.name)
                    .setTitle(`**__Appeal for Ban in ${guild.name}__**`)
                    .setDescription(`${guildid.appeal.reason === true ? `You are Banned for Reason : ${!e.reason ? `No Reason` : e.reason}\nYou can write your appeal now.\n` : `Please Send your appeal.\n`}You can type \`cancel\` to cancel appeal.`)
                    .setColor(`RED`)
                    channel.send({embeds: [embed]})
                    const collector2 = channel.createMessageCollector(r => message.author.id === r.author.id, {max: 1, time: 1200000})
                    collector2.on('collect', msg => {                        
                        const channel2 = client.channels.cache.find(x => guildid.appeal.channel.includes(x.id))
                        if(!channel2) return channel.send(`Your appeal has been sent! You will have to wait till any Mod in server review it.`)
                        if(channel2){
                            const embed = new Discord.MessageEmbed()
                            .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
                            .setTitle(`Ban Appeal`)
                            .setDescription(`**ID** : \`${message.author.id}\`\n**Username** : \`${message.author.tag}\`\n**Account Created** : ${moment(message.author.createdAt).format('MMMM Do YYYY, HH:mm:ss')}\n**Reason for Ban** : ${e.reason}\n**Appeal** : \n${msg.content}`)
                            .setColor(`RED`)
                            channel2.send({embeds: [embed]})
                            return channel.send(`Your appeal has been sent! You will have to wait till any Mod in server review it.`)
                        }
                    })
                }
            })
            collector.on('end', (e, reason) => {
                if(reason !== "ending") channel.send(`You didn't provided any valid response.`)
            })
        }
    }    
