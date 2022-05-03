const Giveaway = require("../Database/Schema/Giveaway");
const Discord = require("discord.js")
module.exports = async (client, i) => {

    if (!i.isButton()) return;
    if(i.customId.startsWith(`Giveaway_Joining_`)){
        let e = i.customId.replace(`Giveaway_Joining_`, ``)
        let giveaway = await Giveaway.findOne({id: e})
        if(!giveaway||giveaway.ended === true){
            const embed = new Discord.MessageEmbed()
            .setTitle(`Ended Giveaway`)
            .setDescription(`This giveaway has ended, you cannot join this now.`)
            .setColor("RED")
            return i.reply({embeds: [embed], ephemeral: true})
        }
        let req = giveaway.requirement
        let participant = giveaway.participant
        if(participant.includes(i.user.id)){
            const embed = new Discord.MessageEmbed()
            .setTitle({name: `Leave Giveaway`})
            .setDescription(`You have already joined this Giveaway, You can click on leave button to leave.`)
            .setColor("RED")
            const button = new Discord.MessageButton()
            .setLabel("Leave")
            .setCustomId(`Giveaway_Leave_${e}`)
            .setStyle("DANGER")
            const row = new Discord.MessageActionRow()
            .addComponents(button)
            return i.reply({embeds: [embed], components: [row], ephemeral: true})
        } else {
            const leavebutton = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId(`Giveaway_Leave_${giveaway.id}`)
                .setStyle("DANGER")
                .setLabel(`Leave`)
            )
            const reqcheck = await client.tools.giveawayreqcheck(i.member, req, giveaway)
            i.reply({embeds: [reqcheck.embed], components: reqcheck.bool === false ? [] : [leavebutton], ephemeral: true })
        }

    }

}