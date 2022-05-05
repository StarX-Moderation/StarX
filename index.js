const Discord = require('discord.js'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    util = require('util'),
    config = require('./config.json'),
    readdir = util.promisify(fs.readdir),
    client = new Discord.Client({ intents: ['GUILD_BANS', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_INVITES', 'GUILDS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MEMBERS'], partials: ['USER', 'REACTION', 'MESSAGE', 'GUILD_SCHEDULED_EVENT', 'CHANNEL'] });

    const {AmariBot} = require("amaribot.js")
// Adding to the client
client.event = new Discord.Collection();
client.commands = new Discord.Collection();
client.logger = require("./Tools/Logger.js")
client.emotes = require("./Tools/Emotes.json")
client.gif = require(`./Tools/gif.json`)
client.config = config;
client.embeds = require(`./Tools/Embeds.js`)
client.tools = require(`./Tools/Tools.js`)
client.Guild = require(`./Database/Schema/Guild.js`)
client.amari = new AmariBot(config.amariapi)

async function init() {
    // Load Discordjs Events
    const eventFiles = fs.readdirSync('./Events/').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`./Events/${file}`);
        const eventName = file.split(".")[0];
        client.logger.event(`Loading event ${eventName}`)
        client.on(eventName, event.bind(null, client));
    }

    //Load the commands
    let folders = await readdir("./Commands/");
    folders.forEach(direct => {
        const commandFiles = fs.readdirSync('./Commands/' + direct + "/").filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`./Commands/${direct}/${file}`);
            client.commands.set(command.name, command);
        }
    })

    // Connect to the database
    mongoose.connect(config.mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        client.logger.log('Connected to MongoDB')
    }).catch((err) => {
        client.log.error('Unable to connect to MongoDB Database.\nError: ' + err)
    })

    await client.login(config.token)
}

init();

process.on('unhandledRejection', err => {
    console.log('Unknown error occured:\n')
    console.log(err)
})
