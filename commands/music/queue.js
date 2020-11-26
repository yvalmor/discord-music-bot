const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class QueueCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'queue',
            aliases: ['song-list', 'next-songs'],
            group: 'music',
            memberName: 'queue',
            guildOnly: true,
            description: 'Display the song queue',
            args: [
                {
                    key: 'page',
                    prompt: 'what page ?',
                    type: 'integer',
                    default: 1
                }
            ]
        });
    }

    run(message, { page }) {
        if (message.guild.musicData.queue.length == 0)
            return message.say('There are no songs in queue!');
        const titleArray = [];

        const nbPage = message.guild.musicData.queue.length / 10;
        page = page > nbPage ? nbPage : page;

        let min = 11 * (page - 1) - (page - 1);
        let max = 10 * page;

        console.log('queueSize: ' + (nbPage * 10));
        console.log('min: ' + min);
        console.log('max: ' + max);

        /* eslint-disable */
        // display only first 10 items in queue
        message.guild.musicData.queue.slice(min, max).forEach(obj => {
            titleArray.push(obj.title);
        });
        /* eslint-enable */
        var queueEmbed = new MessageEmbed()
            .setColor('#ff7373')
            .setTitle('Music Queue');
        for (let i = 0; i < titleArray.length; i++) {
            queueEmbed.addField(`${i + 1}:`, `${titleArray[i]}`);
        }
        return message.say(queueEmbed);
    }
};