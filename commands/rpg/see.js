const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { null_word } = require('../../config.json');
const fs = require('fs');

module.exports = class See extends Command {
    constructor(client) {
        super(client, {
            name: 'see',
            memberName: 'see',
            group: 'rpg',
            aliases: ['see-character'],
            guildOnly: true,
            description:
                'See a character and its data',
            args: [
                {
                    key: 'character_name',
                    prompt: 'What\'s the name of the character you want to see?',
                    type: 'string',
                    wait: 90
                }
            ]
        });
    }

    async run(message, { character_name }) {
        const path = `${process.cwd()}/characters/${message.guild.name}/${character_name}.json`;
        if (! fs.existsSync(path)) {
            message.reply('This character doesn\'t exists!').then();
            return;
        }

        const {
            name, image, levels, age, job, race, HP, MP, initiative, attack, defense, money, traits, stats, inventory, skills, spells
        } = require(path);

        let separate = true;
        const space_separator = '      ';

        let title = `Name: ${name}`;
        if (job !== null_word) {
            title += `${space_separator}${job}`
            separate = false;
        }
        if (race !== null_word) {
            title += `${separate ? space_separator : ' '}${race}`
            separate = false;
        }
        if (levels !== null_word) {
            title += `${separate ? space_separator : ' '}lv${levels}`
            separate = false;
        }
        if (age !== null_word)
            title += `${separate ? space_separator : ', '}${age} years`

        let character = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(title);

        if (image !== null_word)
            character.setThumbnail(image);

        if (HP !== null_word)
            character.addField('HP: ', HP, true);
        if (MP !== null_word)
            character.addField('MP: ', MP, true);

        if (initiative !== null_word)
            character.addField('initiative: ', initiative, true);
        if (attack !== null_word)
            character.addField('attack: ', attack, true);
        if (defense !== null_word)
            character.addField('defense: ', defense, true);
        if (money !== null_word)
            character.addField('money: ', money, true);

        if (traits !== null_word) {
            let trait = '';
            for (let t in traits)
                trait += `${traits[t]}\n`;

            character.addField('\u200B', '\u200B');
            character.addField('Traits:', trait, true);
        }

        if (skills !== null_word) {
            let skill = '';
            for (let s in skills)
                skill += `${skills[s]}\n`;

            if (traits === null_word) character.addField('\u200B', '\u200B');
            character.addField('Skills:', skill, true);
        }

        if (spells !== null_word) {
            let spell = '';
            for (let s in spells)
                spell += `${spells[s]}\n`;

            if (traits === null_word && skills === null_word)
                character.addField('\u200B', '\u200B');
            character.addField('Spells:', spell, true);
        }

        if (stats !== null_word) {
            character.addField('\u200B', '\u200B');
            character.addField('Stats:', '\u200B');

            for (let s in stats) {
                const key = Object.keys(stats[s])[0];
                character.addField(key, stats[s][key], true);
            }
        }

        if (inventory !== null_word) {
            character.addField('\u200B', '\u200B');
            character.addField('Inventory:', '\u200B');

            for (let s in inventory) {
                const key = Object.keys(inventory[s])[0];
                character.addField(key, inventory[s][key], true);
            }
        }

        await message.channel.send({ embed: character });
    }
};