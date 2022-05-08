module.exports = {
    name: "status",
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
        if(!args[0]) return message.reply(`You need to send a status.\nSyntax: ${data.prefix}status [watching/listening/playing] [status]`)

        if(!args[1]) return client.setActivity(args[0])
        if(args[1]){
            if(args[0].toLowerCase() !== `watching` && args[0].toLowerCase() !== `listening` && args[0].toLowerCase() === `playing`){
                let status = args.join(` `)
                client.user.setActivity(status)
            } else {
                let status = args.slice(1).join(` `)
                client.user.setActivity(status, {type: args[0].toUpperCase()})
            }
        }





    }
}