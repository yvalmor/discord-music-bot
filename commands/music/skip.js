const { Command } = require('discord.js-commando');

module.exports = class SkipToCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            memberName: 'skip',
            group: 'music',
            aliases: ['next'],
            description:
                'Skip one song',
            guildOnly: true,
        });
    }

    run(message) {

        var voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return message.reply('Join a channel and try again');

        if (
            typeof message.guild.musicData.songDispatcher == 'undefined' ||
            message.guild.musicData.songDispatcher == null
        ) {
            return message.reply('There is no song playing right now!');
        }

        if (message.guild.musicData.queue < 1)
            return message.say('There are no songs in queue');

        message.guild.musicData.queue.splice(0, 0);
        message.guild.musicData.songDispatcher.end();
        return;
    }
};