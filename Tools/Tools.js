
const Discord = require(`discord.js`);
const Giveaway = require("../Database/Schema/Giveaway.js")
const Guild = require("../Database/Schema/Guild.js")
const db = require("quick.db")
module.exports.giveawayreqcheck = async function (member, requirement, giveaway) {
    const guilddata = await Guild.findOne({ id: member.guild.id })
    const alwaysallowedroles = guilddata.giveaway.alwaysallowedroles
    const embed = new Discord.MessageEmbed()
        .setAuthor({ name: `Successfully Joined Giveaway`, iconURL: "./Tools/gif.json".success })
        .setDescription(`You have joined the Giveaway for \`${giveaway.prize}\``)
        .setColor("GREEN")

    if (alwaysallowedroles.find(r => member.roles.cache.has(r))) {
        return { bool: true, embed: embed }
    }
    const blacklistroles = guilddata.giveaway.blacklistedroles
    if (blacklistroles.find(r => member.roles.cache.has(r))) {
        const embed2 = new Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: `Giveaway Requirement not met`, iconURL: "./Tools/gif.json".error })
            .setDescription(`You cannot join this giveaway.\nYou have role \`${member.guild.roles.cache.find(r => blacklistroles.includes(r.id)).name}\` which is blacklisted from joining giveaways.`)

        return { bool: false, embed: embed2 }

    }
    if (requirement.find(r => r.type === `Bypass Role`)) {
        const bypassroles = requirement.find(r => r.type === `Bypass Role` && member.guild.roles.cache.has(r.required))
        if (bypassroles) return { bool: true, embed: embed }
    }
    if (requirement.find(r => r.type === `Blacklisted Role`)) {
        const blacklistroles = requirement.find(r => r.type === `Blacklisted Role` && member.roles.cache.has(r.required))
        const embed2 = new Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor({ name: `Giveaway Requirement not met`, iconURL: "./Tools/gif.json".error })
            .setDescription(`You cannot join this giveaway.\nYou have role \`${member.guild.roles.cache.find(r => r.id === blacklistroles.required).name}\` which is blacklisted from joining this giveaway.`)

        if (blacklistroles) return { bool: false, embed: embed2 }
    }
    if (requirement.find(r => r.type === `Required Role`) || requirement.find(r => r.type === `Required Amari Level`) || requirement.find(r => r.type === `Required Weekly Amari`)) {
        if (requirement.find(r => r.type === `Required Role` && !member.roles.cache.has(r.required))) {
            const requiredrole = requirement.find(r => r.type === `Required Role` && !member.roles.cache.has(r.required))
            const embed3 = new Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor({ name: `Giveaway Requirement not met`, iconURL: "./Tools/gif.json".error })
                .setDescription(`You cannot join this giveaway.\nYou need \`${member.guild.roles.cache.find(r => requiredrole.required.includes(r.id)).name}\` role to join this giveaway.`)
            if (requiredrole) return { bool: false, embed: embed3 }
        }
        if (requirement.find(r => r.type === `Required Amari Level`)) {
            const config = require("./../config.json");
            const { AmariBot } = require("amaribot.js")
            const amaribot = new AmariBot(config.amariapi)
            let time = db.fetch(`amari_giveaway_requirement_time_${guilddata.id}`)
            if (!time || time < Date.now()) {
                const e = await amaribot.getRawGuildLeaderboard(member.guild.id)
                let newtime = Date.now() + 20000
                db.set(`amari_giveaway_requirement_${guilddata.id}`, newtime)
                db.set(`amari_giveaway_requirement_${guilddata.id}`, e.data)
            }
            let guildamari = db.fetch(`amari_giveaway_requirement_${guilddata.id}`)
            let useramari = guildamari.find(r => r.id === member.user.id)
            const embed4 = new Discord.MessageEmbed()
                .setAuthor({ name: `Error` })
                .setDescription(`An error occured while fetching your amari level. If this error keeps on occuring, report in the support server`)
                .setColor("RED")
            if (!useramari) return { bool: false, embed: embed4 }
            else {
                const requiredamari = requirement.find(r => r.type === `Required Amari Level`)
                if (useramari.level < parseInt(requiredamari.required)) {
                    const embed5 = new Discord.MessageEmbed()
                        .setColor("RED")
                        .setAuthor({ name: `Giveaway Requirement not met`, iconURL: "./Tools/gif.json".error })
                        .setDescription(`You cannot join this giveaway.\nYou need \`${requiredamari.required}\` amari level to join this giveaway.`)
                    return { bool: false, embed: embed5 }
                }
            }
        }
        if (requirement.find(r => r.type === `Required Weekly Amari`)) {
            const config = require("./../config.json");
            const { AmariBot } = require("amaribot.js")
            const amaribot = new AmariBot(config.amariapi)
            let time = db.fetch(`weekly_amari_giveaway_requirement_time_${guilddata.id}`)
            if (!time || time < Date.now()) {
                const e = await amaribot.getRawWeeklyLeaderboard(member.guild.id)
                let newtime = Date.now() + 20000
                db.set(`weekly_amari_giveaway_requirement_${guilddata.id}`, newtime)
                db.set(`weekly_amari_giveaway_requirement_${guilddata.id}`, e.data)
            }
            let guildamari = db.fetch(`weekly_amari_giveaway_requirement_${guilddata.id}`)
            let useramari = guildamari.find(r => r.id === member.user.id)
            const embed4 = new Discord.MessageEmbed()
                .setAuthor({ name: `Error` })
                .setDescription(`An error occured while fetching your weekly amari. If this error keeps on occuring, report in the support server`)
                .setColor("RED")
            if (!useramari) return { bool: false, embed: embed4 }
            else {
                const requiredamari = requirement.find(r => r.type === `Required Weekly Amari`)
                if (useramari.exp < parseInt(requiredamari.required)) {
                    const embed5 = new Discord.MessageEmbed()
                        .setColor("RED")
                        .setAuthor({ name: `Giveaway Requirement not met`, iconURL: "./Tools/gif.json".error })
                        .setDescription(`You cannot join this giveaway.\nYou need \`${requiredamari.required}\` weekly to join this giveaway.`)
                    return { bool: false, embed: embed5 }
                }
            }

        }
    }
    return { bool: true, embed: embed }
}


module.exports.endgiveaway = async function (client, giveawayid, message) {
    let giveaway = await Giveaway.findOne({ id: giveawayid })
    let guild = await Guild.findOne({ id: giveaway.guild })
    let guildid = client.guilds.cache.get(giveaway.guild)
    let channel = guildid.channels.cache.get(giveaway.channel)
    if (!message) {
        message = await channel.messages.fetch(giveawayid)
    }
    console.log(message)
    if (!message) return { type: `Error`, answer: `Giveaway Deleted` }
    let emojidata = guild.giveaway.emote
    let emoji = client.emojis.cache.get(emojidata)
    if (!emoji) emoji = client.emojis.cache.find(e => client.emotes.tada.includes(e.id))
    let reaction = new Discord.Collection()
    if (guild.giveaway.medium === `reaction`) {
        reaction = message.reactions.cache.get(emoji.id).users.cache.filter(user => user.id === client.user.id).map(r => r.id)
        reaction.forEach(e => giveaway.requirement.push(e))
    }
    if (!giveaway) return { type: `Error`, answer: `No Giveaway with that Message` }
    else {

        let participants = giveaway.participant
        let numberofwinners = giveaway.numberofwinners
        if (giveaway.ended === true) numberofwinners = 1


        var index = Math.floor(Math.random() * participants.length)
        var winners = [];
        if (participants.length === 0) return { type: `Success`, answer: `No one` }
        if (numberofwinners >= participants.length) { return { type: `Success`, answer: participants.map(x => `<@${x}>`) } }
        for (var i = 0; i <= numberofwinners; i++) {
            if (!winners.includes(participants[index])) winners.push(participants[index]);
            else i--;
        }
        return { type: `Success`, answer: winners.map(x => `<@${x}>`) }
    }
}


const parseMilliseconds = require('parse-ms');

const pluralize = (word, count) => count === 1 ? word : `${word}s`;

const SECOND_ROUNDING_EPSILON = 0.0000001;

module.exports.prettyMilliseconds = (milliseconds, options = {}) => {
    if (!Number.isFinite(milliseconds)) {
        throw new TypeError('Expected a finite number');
    }

    if (options.colonNotation) {
        options.compact = false;
        options.formatSubMilliseconds = false;
        options.separateMilliseconds = false;
        options.verbose = false;
    }

    if (options.compact) {
        options.secondsDecimalDigits = 0;
        options.millisecondsDecimalDigits = 0;
    }

    const result = [];

    const floorDecimals = (value, decimalDigits) => {
        const flooredInterimValue = Math.floor((value * (10 ** decimalDigits)) + SECOND_ROUNDING_EPSILON);
        const flooredValue = Math.round(flooredInterimValue) / (10 ** decimalDigits);
        return flooredValue.toFixed(decimalDigits);
    };

    const add = (value, long, short, valueString) => {
        if ((result.length === 0 || !options.colonNotation) && value === 0 && !(options.colonNotation && short === 'm')) {
            return;
        }

        valueString = (valueString || value || '0').toString();
        let prefix;
        let suffix;
        if (options.colonNotation) {
            prefix = result.length > 0 ? ':' : '';
            suffix = '';
            const wholeDigits = valueString.includes('.') ? valueString.split('.')[0].length : valueString.length;
            const minLength = result.length > 0 ? 2 : 1;
            valueString = '0'.repeat(Math.max(0, minLength - wholeDigits)) + valueString;
        } else {
            prefix = '';
            suffix = options.verbose ? ' ' + pluralize(long, value) : short;
        }

        result.push(prefix + valueString + suffix);
    };

    const parsed = parseMilliseconds(milliseconds);

    add(Math.trunc(parsed.days / 365), 'year', 'y');
    add(parsed.days % 365, 'day', 'd');
    add(parsed.hours, 'hour', 'h');
    add(parsed.minutes, 'minute', 'm');

    if (
        options.separateMilliseconds ||
        options.formatSubMilliseconds ||
        (!options.colonNotation && milliseconds < 1000)
    ) {
        add(parsed.seconds, 'second', 's');
        if (options.formatSubMilliseconds) {
            add(parsed.milliseconds, 'millisecond', 'ms');
            add(parsed.microseconds, 'microsecond', 'µs');
            add(parsed.nanoseconds, 'nanosecond', 'ns');
        } else {
            const millisecondsAndBelow = `1 second`

            const millisecondsDecimalDigits =
                typeof options.millisecondsDecimalDigits === 'number' ?
                    options.millisecondsDecimalDigits :
                    0;

            const roundedMiliseconds = millisecondsAndBelow >= 1 ?
                `1` :
                `1`;

            const millisecondsString = millisecondsDecimalDigits ?
                millisecondsAndBelow.toFixed(millisecondsDecimalDigits) :
                roundedMiliseconds;

            add(
                Number.parseFloat(millisecondsString, 10),
                'second',
                's',
                millisecondsString
            );
        }
    } else {
        const seconds = (milliseconds / 1000) % 60;
        const secondsDecimalDigits =
            typeof options.secondsDecimalDigits === 'number' ?
                options.secondsDecimalDigits :
                1;
        const secondsFixed = floorDecimals(seconds, secondsDecimalDigits);
        const secondsString = options.keepDecimalsOnWholeSeconds ?
            secondsFixed :
            secondsFixed.replace(/\.0+$/, '');
        add(Number.parseFloat(secondsString, 10), 'second', 's', secondsString);
    }

    if (result.length === 0) {
        return '1 second'
    }

    if (options.compact) {
        return result[0];
    }

    if (typeof options.unitCount === 'number') {
        const separator = options.colonNotation ? '' : ' ';
        return result.slice(0, Math.max(options.unitCount, 1)).join(separator);
    }

    return options.colonNotation ? result.join('') : result.join(' ');
};
