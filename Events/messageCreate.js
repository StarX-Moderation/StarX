const config = require("../config.json"),
    cmdCooldown = {};
const Discord = require(`discord.js`)
module.exports = async (client, message) => {
    try {
        if (!message.guild) return; // Return if dms or group chat

        let guildData = await client.Guild.findOne({ id: message.guild.id });
        if (!guildData) {
            await client.Guild.create({ id: message.guild.id })
            guildData = await client.Guild.findOne({ id: message.guild.id })
        }

        // Define prefix as variable
        let prefix = guildData.prefix

        //Check if message mentions bot only
        if (message.content === `<@!${message.client.user.id}>` || message.content === `<@${message.client.user.id}>`) {
            const embed = new Discord.MessageEmbed()
                .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
                .setDescription(`My prefix in this server is \`${prefix}\`!\nYou can check my commands by using \`${prefix}help\`.`)
                .setColor(`#00FFFF`)
            return message.reply({ embeds: [embed], allowedMentions: { repliedUser: true } });
        }

        // Return if it doesn't start with prefix

        if (!message.content.toLowerCase().startsWith(prefix)) return;
        //Checking if the message is a command
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        //If it isn't a command then return
        if (!cmd) return;

        //If channel isn't nsfw and command is return error
        if (!message.channel.nsfw && cmd.nsfw) {
            return; //Error message
        }

        //If command is owner only and author isn't owner return
        if (cmd.ownerOnly && message.author.id !== config.ownerId) {
            return;
        }

        let userPerms = [];
        //Checking for members permission
        cmd.memberPermissions.forEach((perm) => {
            if (!message.channel.permissionsFor(message.member).has(perm)) {
                userPerms.push(perm);
            }
        });
        //If user permissions arraylist length is more than one return error
        if (userPerms.length > 0 && !message.member.roles.cache.find((r) => r.name.toLowerCase() === config.adminRole.toLowerCase())) {
            client.logger.cmd(`${message.author.tag} used ${cmd.name} - Missing permissions`);
            return message.channel.send("Looks like you're missing the following permissions:\n" + userPerms.map((p) => `\`${p}\``).join(", "));
        }

        let clientPerms = [];
        //Checking for client permissions
        cmd.botPermissions.forEach((perm) => {
            if (!message.channel.permissionsFor(message.guild.me).has(perm)) {
                clientPerms.push(perm);
            }
        });
        //If client permissions arraylist length is more than one return error
        if (clientPerms.length > 0) {
            client.logger.cmd(`${message.author.tag} used ${cmd.name} - Missing permissions`);
            return message.channel.send("Looks like I'm missing the following permissions:\n" + clientPerms.map((p) => `\`${p}\``).join(", "));
        }

        let userCooldown = cmdCooldown[message.author.id];

        if (!userCooldown) {
            cmdCooldown[message.author.id] = {};
            uCooldown = cmdCooldown[message.author.id];
        }

        let time = uCooldown[cmd.name] || 0;
        //Check if user has a command cooldown
        if (time && (time > Date.now())) {
            let timeLeft = Math.ceil((time - Date.now()) / 1000);
            return message.channel.send(`Command is on cooldown. You need to wait ${timeLeft} seconds`)//Error message
        }

        cmdCooldown[message.author.id][cmd.name] = Date.now() + cmd.cooldown;

        //Get the user database
        let data = {};
        data.cmd = cmd;
        data.prefix = prefix
        data.config = config;
        //Execute the command and log the user in console
        cmd.execute(client, message, args, data);
        client.logger.cmd(`${message.author.tag} used ${cmd.name}`);


    } catch (err) {
        console.log(err);
    }

};