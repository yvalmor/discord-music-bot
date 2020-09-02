const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { null_word, characteristics } = require('../../config.json');
const fs = require('fs');

const edit_details =
    'For the characteristics like name, image, HP, MP, ... you can just enter the value or \`empty\` if you want to remove the field\n' +
    'For characteristics like inventory or stats there are 4 possibilities :\n' +
    '    1. You want to overwrite the characteristic: you must enter the new value between \`[\` and \`]\` with \`,\` between each values and the value must be entered this way: \`name: value\`\n' +
    '    2. You want to remove the field: you must enter \`empty\`\n' +
    '    3. You want to add/replace a value in the characteristic: you must enter the value this way: \`name: value\`\n' +
    '    4. You want to add/replace multiple values in the characteristic: you must enter the values this way: \`name1: value1, name2: value2, ...\`' +
    'For characteristics like traits, skills or spells there are 4 possibilities:\n' +
    '    1. You want to overwrite the characteristic: you must enter the new value this way: `[name1, name2, name3, ...]\`' +
    '    2. You want to remove the field: you must enter \`empty\`\n' +
    '    3. You want to add a value in the characteristic: you must enter the value this way: \`name\`\n' +
    '    4. You want to add multiple values in the characteristic: you must enter the values this way: \`name1, name2, ...\`';

module.exports = class See extends Command {
    constructor(client) {
        super(client, {
            name: 'edit',
            memberName: 'edit',
            group: 'rpg',
            aliases: ['edit-character'],
            guildOnly: true,
            description: 'Edit a character and its data',
            details: edit_details,
            args: [
                {
                    key: 'character_name',
                    prompt: 'What\'s the name of the character you want to edit?',
                    type: 'string',
                    wait: 90
                },
                {
                    key: 'stat_name',
                    prompt: 'What\s the name of the characteristic you want to edit?',
                    type: 'string',
                    wait: 90,
                    validate: stat_name => characteristics.indexOf(stat_name) !== -1
                },
                {
                    key: 'value',
                    prompt: 'What\'s the new value of the characteristic?',
                    type: 'string',
                    wait: 300,
                    validate: value => value === null_word || value.length > 0
                }
            ]
        });
    }

    async run(message, { character_name, stat_name, value }) {
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

        let obj = {
            'name': name,
            'image': image,
            'HP': HP,
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

        //Replace the value needed
        switch (stat_name) {
            case 'name':
                obj.name = value;
                name = value;
                break;
            case 'image':
                obj.image = value;
                image = value;
                break;
            case 'levels':
                obj.levels = value;
                levels = value;
                break;
            case 'age':
                obj.age = value;
                age = value;
                break;
            case 'job':
                obj.job = value;
                job = value;
                break;
            case 'race':
                obj.race = value;
                race = value;
                break;
            case 'HP':
                obj.HP = value;
                HP = value;
                break;
            case 'base_HP':
                obj.base_HP = value;
                base_HP = value;
                break;
            case 'MP':
                obj.MP = value;
                MP = value;
                break;
            case 'alignment':
                obj.alignment = value;
                alignment = value;
                break;
            case 'proficiency':
                obj.proficiency = value;
                proficiency = value;
                break;
            case 'initiative':
                obj.initiative = value;
                initiative = value;
                break;
            case 'attack':
                obj.attack = value;
                attack = value;
                break;
            case 'defense':
                obj.defense = value;
                defense = value;
                break;
            case 'money':
                obj.money = value;
                money = value;
                break;
            case 'inventory':
                obj.inventory = this.dict_modification(inventory, value);
                inventory = obj.inventory;
                break;
            case 'stats':
                obj.stats = this.dict_modification(stats, value);
                stats = obj.stats;
                break;
            case 'traits':
                obj.traits = this.array_modification(traits, value);
                traits = obj.traits;
                break;
            case 'skills':
                obj.skills = this.array_modification(skills, value);
                skills = obj.skills;
                break;
            case 'spells':
                obj.spells = this.array_modification(spells, value);
                spells = obj.spells;
                break;
        }

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

        await fs.unlink(path, (err => {
            if (err) console.log(err)
        }));

        await fs.writeFileSync(
            `${process.cwd()}/characters/${message.guild.name}/${name}.json`, JSON.stringify(obj, any => any, 4));

        await message.channel.send({ embed: character });
    }

    dict_modification(array, string){
        if (string === null_word)
            return string;

        if (string[0] === '[' && string[string.length - 1] === ']'){
            let new_array = [];
            string = string.substring(1, string.length - 1);
            for (const value of string.split(', ')){
                const val = value.split(': ');
                let o = {}
                o[val[0]] = val.length === 1 ? 1 : val[1];
                new_array.push(o);
            }

            return new_array;
        }

        for (const new_value of string.split(', ')){
            const new_val = new_value.split(': ');
            const key = new_val[0];
            const val = new_val.length === 1 ? 1 : new_val[1];

            let index = -1;
            let o = {}
            o[key] = val;

            for (let i = 0; i < array.length; i++)
                if (Object.keys(array[i])[0] === key) {
                    index = i;
                    break;
                }

            if (index === -1)
                array.push(o)
            else
                array[index] = o;
        }

        return array;
    }

    array_modification(array, string){
        if (string === null_word)
            return string;

        if (string[0] === '[' && string[string.length - 1] === ']'){
            let new_array = [];
            string = string.substring(1, string.length - 1);

            for (const value of string.split(', '))
                new_array.push(value);

            return new_array;
        }

        for (const new_value of string.split(', ')){
            const i = array.indexOf(new_value);

            if (i === -1)
                array.push(new_value);
            else
                array[i] = new_value;
        }

        return array;
    }
};