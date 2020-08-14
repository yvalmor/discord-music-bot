const { Command } = require('discord.js-commando');
const skipall = require('./skipall');
const play = require('./play');

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'play-now',
            aliases: ['play-song-now', 'pn', 'playnow'],
            memberName: 'play-now',
            group: 'music',
            description: 'Play any song or playlist from youtube and skip all the previous ones',
            guildOnly: true,
            clientPermissions: ['SPEAK', 'CONNECT'],
            throttling: {
                usages: 2,
                duration: 5
            },
            args: [
                {
                    key: 'query',
                    prompt: 'What song or playlist would you like to listen to?',
                    type: 'string',
                    validate: function(query) {
                        return query.length > 0 && query.length < 200;
                    }
                }
            ]
        });
    }

    async run(message, { query }) {
        await skipall.run(message);
        await play.run(message, { query });
    }
}