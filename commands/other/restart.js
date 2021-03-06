const { token } = require('../../config.json')
const { Command } = require('discord.js-commando');

module.exports = class ReloadCommand extends Command {

    constructor(client){
        super(client, {
            name: 'restart',
            group: 'other',
            memberName: 'restart',
            description: 'reload a command or the entire bot, OWNER ONLY',
            ownerOnly: true,
            hidden: true,
            usage: '[command name]',
        });
    }

    run(message, args) {
        if (!args.length) {
            console.log('Restarting...')
            return message.channel.send(`Restarting...`)
                .then(() => message.client.destroy())
                .then(() => message.client.login(token))
                .then(() => message.channel.send(`Restarted!`))
                .then(() => console.log('Restarted!'));
        }

        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command)
            return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
            console.log(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }

        return message.channel.send(`Command \`${command.name}\` was reloaded!`);
    }
}