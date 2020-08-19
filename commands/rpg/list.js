const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { null_word } = require('../../config.json');
const fs = require('fs');

module.exports = class List extends Command {
    constructor(client) {
        super(client, {
            name: 'list',
            memberName: 'list',
            group: 'rpg',
            aliases: ['list-character', 'lc'],
            guildOnly: true,
            description:
                'Lists all the existing characters',
        });
    }

    async run(message, { name }) {
        const path = `./characters/${message.guild.name}`;
        if (await fs.access(`./characters/${message.guild.name}`, (err => console.log(err))))
        {
            message.reply('There isn\'t any character yet!').then();
            return;
        }

        const characterFiles = fs.readdirSync(path).filter(file => file.endsWith('.json'));

        if (characterFiles.length === 0)
        {
            message.reply('There isn\'t any character yet!').then();
            return;
        }

        let characters = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle('Characters:');

        for (const file of characterFiles) {
            const {
                name, levels, age, job, race
            } = require(`../.${path}/${file}`);

            let separate = true;
            const space_separator = '      ';
            let content = '';

            if (job !== null_word) {
                content += `${space_separator}${job}`
                separate = false;
            }
            if (race !== null_word) {
                content += `${separate ? space_separator : ' '}${race}`
                separate = false;
            }
            if (levels !== null_word) {
                content += `${separate ? space_separator : ' '}lv${levels}`
                separate = false;
            }
            if (age !== null_word)
                content += `${separate ? space_separator : ', '}${age} years`

            characters.addField(name, content);
            console.log(content);
        }
        await message.channel.send(characters);
    }
};