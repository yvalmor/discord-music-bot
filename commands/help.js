const { prefix } = require('../config.json');
const { Command } = require('discord.js-commando');

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            group: 'other',
            memberName: 'help',
            description: 'display a list of the commands or the usage of a specific command',
            aliases: ['commands'],
            usage: '[command name]',
        });
    }

    run(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Here\'s a list of all the commands:');
            data.push(commands.map(command =>
                `\t${command.name}${command.aliases ? ` / ${command.aliases.join(' / ')}` : ''} ${command.usage}`)
                .join('\n'));
            data.push('\nYou can use \`help [command name / command alias]\` to get info on a specific command');
        }
        else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command)
                return message.reply('That\'s not a valid command!');

            data.push(`**Name:** ${command.name}`);

            if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
            if (command.description) data.push(`**Description:** ${command.description}`);
            if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        }

        return message.author.send(data, { split: true })
            .then(() => {
                if (message.channel.type === 'dm') return;
                message.reply('A help message has been sent to you by DM');
            })
            .catch(error => {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
            });
    };
}