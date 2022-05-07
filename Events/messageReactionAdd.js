const Discord = require(`discord.js`)
const Giveaway = require("../Database/Schema/Giveaway")

module.exports = async (client, reaction, user) => {
    if(user.bot) return
    const giveaway = await Giveaway.findOne({ id: reaction.message.id })
    //Reaction Add
    if (giveaway) {
        let req = giveaway.requirement
        let participant = giveaway.participant
        if (participant.includes(user.id)) {
            return
        } else {
            
            let member = await reaction.message.guild.members.fetch(user)
            const reqcheck = await client.tools.giveawayreqcheck(member, req, giveaway)
            if (reqcheck.bool === true) {
                await Giveaway.findOneAndUpdate({ id: giveaway.id }, { $push: { participant: user.id.toString() } }, { upsert: true })
            }
            if(reqcheck.bool === false){
                reaction.message.reactions.resolve(`${reaction.emoji.id}`).users.remove(`${user.id}`);

                user.send({embeds: [reqcheck.embed]})
            }
        }
    }
    //End
}