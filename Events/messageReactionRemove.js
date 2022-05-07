const Discord = require(`discord.js`)
const Giveaway = require("../Database/Schema/Giveaway")

module.exports = async (client, reaction, user) => {
    if (user.bot) return
    const giveaway = await Giveaway.findOne({ id: reaction.message.id })

    //Giveaway Reaction Removed
    if (giveaway) {
        let req = giveaway.requirement
        let participant = giveaway.participant
        if (participant.includes(user.id)) {
                await Giveaway.findOneAndUpdate({ id: giveaway.id }, { $pull: { participant: user.id.toString() } }, { upsert: true })
        }
    }
    //Giveaway Reaction 

}