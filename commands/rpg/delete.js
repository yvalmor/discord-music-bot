const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class Delete extends Command {
    constructor(client) {
        super(client, {
            name: 'delete',
            memberName: 'delete',
            group: 'rpg',
            aliases: ['remove-character', 'rc'],
            guildOnly: true,
            description:
                'Delete a character and its data',
            args: [
                {
                    key: 'name',
                    prompt: 'What\'s the name of the character you want to delete?',
                    type: 'string'
                }
            ]
        });
    }

    async run(message, { name }) {
        const path = `${process.cwd()}/characters/${message.guild.name}/${name}.json`;
        if (fs.existsSync(path))
        {
            await fs.unlink(path, (err => {
                console.log(err);
            }));
            await message.reply('Character deleted!')
        }
        else
            await message.reply('This character doesn\'t exists!');
    }
};