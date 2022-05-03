const db = require(`quick.db`)

module.exports = async(client) => {
    client.logger.ready(`Logged in as ${client.user.tag}!`)
    client.user.setPresence({ activity: { name: 'for a!help', type: "WATCHING" }, status: "online" });


}