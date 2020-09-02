const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { null_word } = require('../../config.json');
const fs = require('fs');

module.exports = class Damage extends Command {
    constructor(client) {
        super(client, {
            name: 'damage',
            group: 'rpg',
            memberName: 'damage',
            aliases: ['dmg'],
            description: 'Inflicts [dmg] damages to [name] player',
            args: [
                {
                    key: 'character_name',
                    prompt: 'What\'s the name of the character you want to edit?',
                    type: 'string',
                    wait: 90
                },
                {
                    key: 'value',
                    prompt: 'How much damages?',
                    type: 'integer',
                    wait: 90,
                    validate: value => value >= 0
                }
            ]
        });
    }

    async run(message, {character_name, value}) {
        const path = `${process.cwd()}/characters/${message.guild.name}/${character_name.replace('_', ' ')}.json`;
        try {
            fs.existsSync(path)
        } catch (e) {
            console.error(e);
            message.reply('This character doesn\'t exists!').then();
            return;
        }

        let {
            name, image, levels, age, job, race,
            HP, base_HP, MP, alignment, proficiency, initiative, attack, defense, money,
            traits, stats, inventory, skills, spells
        } = require(path);

        if (HP === null_word)
        {
            message.reply('This character doesn\'t have the HP characteristic').then();
            return;
        }

        let obj = {
            'name': name,
            'image': image,
            'HP': !HP.isNaN ? HP - value : HP,
            'base_HP': base_HP,
            'MP': MP,
            'levels': levels,
            'age': age,
            'job': job,
            'race': race,
            'money': money,
            'alignment': alignment,
            'proficiency': proficiency,
            'initiative': initiative,
            'attack': attack,
            'defense': defense,
            'traits': traits,
            'stats': stats,
            'inventory': inventory,
            'skills': skills,
            'spells': spells
        };

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

            let stat = '';

            for (let s in stats) {
                const key = Object.keys(stats[s])[0];
                stat += `${key}: ${stats[s][key]}\n`;
            }

            character.addField('Stats:', stat);
        }

        if (inventory !== null_word) {
            character.addField('\u200B', '\u200B');
            character.addField('Inventory:', '\u200B');

            for (let s in inventory) {
                const key = Object.keys(inventory[s])[0];
                character.addField(key, inventory[s][key], true);
            }
        }

        if (obj.HP <= 0) {
            obj.HP = 0;
            character.setImage('https://thumbs.gfycat.com/OrdinaryFakeAllensbigearedbat-size_restricted.gif');
        }

        await fs.unlink(path, (err => {
            if (err) console.log(err)
        }));

        await fs.writeFileSync(
            `${process.cwd()}/characters/${message.guild.name}/${name}.json`, JSON.stringify(obj, any => any, 4));

        await message.channel.send({ embed: character });
    }
}