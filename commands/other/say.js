const { Command } = require('discord.js-commando');

module.exports = class Update extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            group: 'other',
            memberName: 'say',
            description: 'Says something',
            hidden: true,
            args:
                [
                    {
                        key: 'msg',
                        prompt: 'message',
                        type: 'string'
                    }
                ]
        });
    }

    run(message, { msg }) {
        message.reply(msg.replace('\n', '\\n')).then();
    }
}