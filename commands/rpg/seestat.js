const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { null_word } = require('../../config.json');
const fs = require('fs');

module.exports = class See extends Command {
    constructor(client) {
        super(client, {
            name: 'seestat',
            memberName: 'seestat',
            group: 'rpg',
            aliases: ['see-stat'],
            guildOnly: true,
            description:
                'See a character and its data',
            args: [
                {
                    key: 'character_name',
                    prompt: 'What\'s the name of the character you want to see?',
                    type: 'string',
                    wait: 90
                },
                {
                    key: 'stat_name',
                    prompt: 'What\'s the name of the stat you want to see?',
                    type: 'string',
                    wait: 90
                }
            ]
        });
    }

    async run(message, { character_name, stat_name }) {

        const path =
            `${process.cwd()}/characters/${message.guild.name}/${
                character_name === 'Tiramisu' || character_name.replace('_', ' ') === 'Tiramisu Uchiha' ?
                    'Tsunami Uchiha' : character_name.replace('_', ' ')}.json`;
        try {
            fs.existsSync(path)
        } catch (e) {
            console.error(e);
            message.reply('This character doesn\'t exists!').then();
            return;
        }

        const {
            name, image, levels, age, job, race,
            HP, base_HP, MP, alignment, proficiency, initiative, attack, defense, money,
            traits, stats, inventory, skills, spells
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

        switch (name.replace('_', ' ')){
            case 'Glenn Hyakuya':
                character.setURL('https://www.youtube.com/watch?v=rp8hvyjZWHs');
                break;
            case 'Erity Labard':
                character.setURL('https://www.youtube.com/watch?v=JOfqoq3_mEE');
                break;
            case 'Tsunami Uchiha':
            case 'Tiramisu':
            case 'Tiramisu Uchiha':
                character.setURL('https://www.youtube.com/watch?v=cLmCJKT5ssw');
                break;
            case 'Eyy Teikonia':
                character.setURL(
                    Math.floor(Math.random() * 2 + 1) === 2
                        ? 'https://imgur.com/KndTYNA'
                        : 'https://www.youtube.com/watch?v=ZFh301OAgSI');
                break;
        }


        if (image !== null_word)
            character.setThumbnail(image);

        if (HP !== null_word)
            character.addField('HP: ', `${HP}/${base_HP}`, true);
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

        if (alignment !== null_word)
            character.addField('alignment: ', alignment, true);
        if (proficiency !== null_word)
            character.addField('proficiency: ', proficiency, true);

        if (traits !== null_word && (stat_name === '' || stat_name === 'traits')) {
            let trait = '';
            for (let t in traits)
                trait += `${traits[t]}\n`;

            character.addField('\u200B', '\u200B');
            character.addField('Traits:', trait, true);
        }

        if (skills !== null_word && (stat_name === '' || stat_name === 'skills')) {
            let skill = '';
            for (let s in skills)
                skill += `${skills[s]}\n`;

            if (traits === null_word) character.addField('\u200B', '\u200B');
            character.addField('Skills:', skill, true);
        }

        if (spells !== null_word && (stat_name === '' || stat_name === 'spells')) {
            let spell = '';
            for (let s in spells)
                spell += `${spells[s]}\n`;

            if (traits === null_word && skills === null_word)
                character.addField('\u200B', '\u200B');
            character.addField('Spells:', spell, true);
        }

        if (stats !== null_word && (stat_name === '' || stat_name === 'stats')) {
            character.addField('\u200B', '\u200B');

            let stat = '';

            for (let s in stats) {
                const key = Object.keys(stats[s])[0];
                stat += `${key}: ${stats[s][key]}\n`;
            }

            character.addField('Stats:', stat, true);
        }

        if (inventory !== null_word && (stat_name === '' || stat_name === 'inventory')) {
            if (stats === null_word || stat_name === 'inventory')
                character.addField('\u200B', '\u200B');

            let invent = '';

            for (let s in inventory) {
                const key = Object.keys(inventory[s])[0];
                invent += `${key}: ${inventory[s][key]}\n`;
            }

            character.addField('Inventory:', invent, true);
        }

        await message.channel.send({ embed: character });
    }
};
