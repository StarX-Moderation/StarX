const Discord = require("discord.js");
const Guild = require("../../Database/Schema/Guild");

module.exports = {
    //Command Information
    name: "raffle",
    description: "Start a raffle in Server.",
    usage: "raffle [arguements]",
    enabled: true,
    aliases: ["r"],
    subcategory: "**Commands**",
    category: "utility",
    memberPermissions: ["MANAGE_GUILD"],
    memberp: ["Manage Server"],
    subcommand: [{name: `start`, description: `Start Raffle`, usage: `start`}, {name: `entries`, description: `check entries of raffle.`, usage: `entries`}, {name: `status`, description: `Check status of raffle.`, usage: `status`}, {name: `end`, description: `End raffle.`, usage: `end`}, {name: `addticket`, description: `Add tickets of Users.`, usage: `addticket [users:<no. of tickets>]`}, {name: `reset`, description:`Reset the current raffle.`, usage: `reset`}],
    botPermissions: [ "SEND_MESSAGES", "EMBED_LINKS", "ADD_REACTIONS" ],
    botp: ["Send Messages, Embed Links, Add Reactions"],
    nsfw: false,
    cooldown: 3000,
    ownerOnly: false,

    async execute(client, message, args, data) {
        
        let guild = await Guild.findOne({id: message.guild.id})
        if(!guild) guild = new Guild({id: message.guild.id})

        if(!args[0]){
            const embed = new Discord.MessageEmbed()
            .setAuthor({name: `Missing Arguement`, iconURL: client.emotes.cross})
            .setColor(`RED`)
            .setDescription(`You need to provide some valid arguements.\nCheck \`${data.prefix}help raffle\` to know about subcommands of this command.`)
            return message.channel.send({embeds: [embed]})
        }
        if(args[0].toLowerCase() === `start`){
            let array = {host: message.author.id, entries: []}
            let numwinner = 1
            let channeltoshow = false
            if(args[1]){
                const ar2 = args[1].split(`:`)
                ar2.forEach(ar3 => {
                    let ar = ar3.split(`;`)
                    if(ar[0] === `winners`){
                        if(isNaN(ar[1])||!ar[1]) return message.channel.send(`You have to provide valid number of winners.`)
                        numwinner = parseInt(ar[1])
                    }
                if(ar[0] === `logchannel`){

                if(!ar[1]) return message.channel.send(`Provide a channel.`)
                const channel = client.channels.cache.find(r => ar[1].includes(r.id))
                if(!channel) message.channel.send(`Cannot find channel \`${ar[1]}\``, {disableMentions: 'all'}) 
                if(channel) channeltoshow = channel.id
                }
            })
            }
            if(guild.raffle && guild.raffle.length > 0) return message.channel.send(`There is already a raffle going on in this server.`)
            await Guild.findOneAndUpdate({id: message.guild.id}, {$set: {raffle: {host: message.author.id, entries: [], numwinner: numwinner, channel: channeltoshow}}}, {upsert: true})
            const embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setTitle(`Raffle Started`)
            .setColor(`00E4FF`)
            .setFooter(`Hosted By┃${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
            .setDescription(`┃Raffle has been started in the server.\n┃You can use \`${data.prefix}r addticket [user:tickets]\` to add tickets to a user.\n┃Use \`${data.prefix}r status\` to check status of Raffle.`)
            return message.channel.send({embeds: [embed]})
        }
        if(args[0].toLowerCase() === `entries`){
            const embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setTitle(`Raffle Entries`)
            .setColor(`00E4FF`)
            if(!guild.raffle||!guild.raffle.length){
                embed.setDescription(`There is no Raffle going on in this server.`)
                return message.channel.send({embeds: [embed]})
            }
            if(!guild.raffle[0].entries||!guild.raffle[0].entries.length){
                embed.setDescription(`No One joined raffle yet.`)
                return message.channel.send({embeds: [embed]})
            } else {
                const guilds = guild.raffle[0].entries
                /**
                * Creates an embed with guilds starting from an index.
                * @param {number} start The index to start from.
                */
                const generateEmbed = start => {
                    const current = guilds.slice(start, start + 15)
                    // you can of course customise this embed however you want
  
                    const array = []
                    let gay = []

                    current.forEach((g) => {
                        gay += `\`${guilds.indexOf(g)+1}\`│${g.user} - (\`${g.id}\`)\n`
                    })
                    embed.setDescription(`${gay}`)
                    return embed
  
                  }
                  // edit: you can store the message author like this:
  
                  const author = message.author
                  // send the embed with the first 10 guilds
                  message.channel.send({embeds: [generateEmbed(0)]}).then(message => {
                      // exit if there is only one page of guilds (no need for all of this)
                      if (guilds.length <= 15) return
                      // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
                      message.react('819861184673087541')
                      const collector = message.createReactionCollector(
                          // only collect left and right arrow reactions from the message author
                          (reaction, user) => ['829732095580045362', '819861184673087541'].includes(reaction.emoji.id) && user.id === author.id,
                          // time out after a minute
                          {time: 60000}
                          )
                          let currentIndex = 0
  
                          collector.on(`end`, reaction => {
                              message.reactions.removeAll()
                          })
  
                          collector.on('collect', reaction => {
                              // remove the existing reactions
                              message.reactions.removeAll().then(async () => {
                                  // increase/decrease index
                                  reaction.emoji.id === '829732095580045362' ? currentIndex -= 15 : currentIndex += 15
                                  // edit message with new emb
                                  message.edit(generateEmbed(currentIndex))
                                  // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                                  if (currentIndex !== 0) await message.react('829732095580045362')
                                  // react with right arrow if it isn't the end
                                  if (currentIndex + 15 < guilds.length) message.react('819861184673087541')
                              })
                          }) 
                      })
            }
        }
        if(args[0].toLowerCase() === `addticket`){
            const embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setTitle(`Raffle Tickets`)
            .setColor(`00E4FF`)
            if(!args[1]){
                embed.setDescription(`You need to provide User.`)
                return message.channel.send({embeds: [embed]})
            }
            if(args[1]){
                const args2 = args.slice(1)
                let array2 = []
                function resolveMember(e, guild){
                    if(!e) return
                    const membed = guild.members.cache.find(r => e.includes(r.id))
                    if(membed) return membed.user
                    if(!membed) return
                }
                let number200 = 0
                let length = guild.raffle[0].entries.length
                args2.forEach(a => {
                    const ar = a.split(`:`)
                    const user = resolveMember(ar[0], message.guild)
                    if(!user) return message.channel.send(`User \`${ar[0]}\` not found`, {disableMentions: 'all'})
                    if(user) {
                        let number = ar[1]
                        if(number > 10) return message.channel.send(`You can add maximum of 10 Tickets at a time\nYou tried to add ${ar[1]} tickets for \`${user.tag}\``, {disableMentions: 'all'})
                        if(!number) number = 1
                        if(isNaN(number)) return message.channel.send(`You have to provide valid number of tickets for User \`${user.tag}\``, {disableMentions: 'all'})
                        if(number < 1) return message.channel.send(`You can't add less than 1 Ticket for someone-`)
                        for(let i = 0;i < parseInt(number); i++){
                            var ObjectID = require('mongodb').ObjectID;
                            let idofelement = new ObjectID() 
                            array2.push({id: user.id, user: user.tag, _idofelement: idofelement})
                        }
                    }
                })
                let number2000 = length
                array2.forEach(async r => {
                    await Guild.findOneAndUpdate({id: message.guild.id}, {$push: {"raffle.0.entries": r}})
                    const embed2 = new Discord.MessageEmbed()
                    .setTitle(`Raffle Ticket #${number2000+1}`)
                    .setDescription(`\`${r.user}\` - <@${r.id}>`)
                    .setFooter(`ID: ${r.id}`)
                    .setColor(`00E4FF`)
                    number2000++
                    const channel = client.channels.cache.get(guild.raffle[0].channel)
                    if(channel) await channel.send({embeds: [embed2]}).catch(err => {return})
                })
                let guild2 = await Guild.findOne({id: message.guild.id})
                const guilds = array2
                /**
                * Creates an embed with guilds starting from an index.
                * @param {number} start The index to start from.
                */
                const generateEmbed = start => {
                    const current = guilds.slice(start, start + 15)
                    // you can of course customise this embed however you want

                    const array = []
                    let gay = []
                    for(let i = 0; i< current.length; i++){
                        gay += `\`${length+1}\`│${current[i].user} - \`(${current[i].id})\`\n`
                        length++
                }
                    embed.setDescription(`Added ${array2.length} tickets.\n${gay}`)
                    return embed
  
                  }
                  // edit: you can store the message author like this:
                  const author = message.author
                  // send the embed with the first 10 guilds
                  message.channel.send({embeds: [generateEmbed(0)]}).then(message => {
                      // exit if there is only one page of guilds (no need for all of this)
                      if (guilds.length <= 15) return
                      // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
                      message.react('819861184673087541')
                      const collector = message.createReactionCollector(
                          // only collect left and right arrow reactions from the message author
                          (reaction, user) => ['829732095580045362', '819861184673087541'].includes(reaction.emoji.id) && user.id === author.id,
                          // time out after a minute
                          {time: 60000}
                          )
                          let currentIndex = 0
  
                          collector.on(`end`, reaction => {
                              message.reactions.removeAll()
                          })
  
                          collector.on('collect', reaction => {
                              // remove the existing reactions
                              message.reactions.removeAll().then(async () => {
                                  // increase/decrease index
                                  reaction.emoji.id === '829732095580045362' ? currentIndex -= 15 : currentIndex += 15
                                  // edit message with new emb
                                  message.edit(generateEmbed(currentIndex))
                                  // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                                  if (currentIndex !== 0) await message.react('829732095580045362')
                                  // react with right arrow if it isn't the end
                                  if (currentIndex + 15 < guilds.length) message.react('819861184673087541')
                              })
                          }) 
                      })
                      return
            }
        }
        if(args[0].toLowerCase() === `status`){
            const embed2 = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setTitle(`Raffle Status`)
            .setColor(`00E4FF`)
            if(!guild.raffle||!guild.raffle.length){
                embed2.setDescription(`There is no Raffle going on in this server.`)
                return message.channel.send({embeds: [embed]})
            } else {
                embed2.setDescription(`┃Hosted By: <@${guild.raffle[0].host}>\n┃Total Entries: \`${guild.raffle[0].entries.length}\``)
                return message.channel.send({embeds: [embed2]})
            }

        }
        if(args[0].toLowerCase() === `reset`){
            const embed = new Discord.MessageEmbed()
            .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
            .setTitle(`Reset Raffle`)
            .setDescription(`WARNING! This will reset all data of raffle in this server.\nIf there is any raffle going on in server, It will reset that.\nReact to choose\n${client.emotes.successemote}│Reset\n${client.emotes.erroremote}│Cancel`)
            .setColor(`RED`)
            const msg = await message.channel.send({embeds: [embed]})
            await msg.react(client.emotes.successemote)
            await msg.react(client.emotes.erroremote)
            const collector = msg.createReactionCollector((reaction, user) => [client.emotes.successemote, client.emotes.reddot].includes(reaction.emoji.id) && user.id === author.id, {max: 1, time: 100000})
            collector.on('collect', async (reaction, user) => {
                if(client.emotes.successemote.includes(reaction.emoji.id)) {
                    await Guild.findOneAndUpdate({id: message.guild.id}, {$set: {raffle: []}})
                    return message.channel.send(`Successfully resetted Raffles in this server.`)
                } else {
                    return message.channel.send(`Cancelled action.`)
                }
            })
        }
        if(args[0].toLowerCase() === `end`){
            if(!guild.raffle||!guild.raffle.length){
                return message.channel.send(`There is no raffle in this server...`)
            }
            if(!guild.raffle[0].entries||!guild.raffle[0].entries.length){
                return message.channel.send(`No one joined the raffle-`)
            }
            let hostedby = '?'
            if(!hostedby) hostedby = ` hosted by <@${guild.raffle[0].host}>?`
            message.channel.send(`Are you sure? Do you want to end raffle${hostedby} Yes/No`, {disableMentions: 'all'})
            const filter = r => r.author.id === message.author.id
            const collector = message.channel.createMessageCollector({filter, time: 50000, max: 1})
            collector.on('collect', async m => {
                if(m.content.toLowerCase() === `yes`){

                    const raffle = guild.raffle[0].entries
                    let numwinner = guild.raffle[0].numwinner
                    var winners = [];
                    var winnerMessage = "";
                    if(raffle.length < numwinner){
                      winners = raffle; // Add everyone to the list of winners if the number of participants is less than or equal to the number winners
                    }
                    else{
                      let index = 0;
                      for(var i = 0; i < numwinner; i++){
                        index = Math.floor(Math.random() * (raffle.length - 1)); // Subtract 1 from peopleReacted.length to prevent an Array Out of Bounds exception
                        if(!winners.includes(raffle[index])) winners.push(raffle[index]);
                        else i--; // Don't progress the loop if no winner is selected.
                      }
                    }
    
    
                    let winner = winners.map(x => `<@${x.id}>`).join(` `)
                    let winningnumber = winners.map(x => raffle.indexOf(x)+1).join(`, `)

                if(winners.length < 1) winner = `No one`
                if(!winner) winner = `No one`
                if(!winner.length) winner = `No one`
                if(winner === ``) winner = `No one`
                collector.stop()
                    await Guild.findOneAndUpdate({id: message.guild.id}, {$set: {raffle: []}})
                    const embed = new Discord.MessageEmbed()
                    .setAuthor(message.guild.name, message.guild.iconURL({dynamic: true}))
                    .setTitle(`${client.emotes.tada} Raffle Ended ${client.emotes.tada}`)
                    .setColor(`00E4FF`)
                    .setDescription(`Winning Ticket Number: \`${winningnumber}\`\nWinner(s): ${winner}.\nTotal Entries: \`${raffle.length}\`\nHosted By: <@${guild.raffle[0].host}>`)
                    return message.channel.send({embeds: [embed]}) 
                } else {
                    collector.stop()
                    return message.channel.send(`Alright, I ain't ending raffle yet.`)
                }
            })
        }
    }
}