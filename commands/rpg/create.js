const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const { null_word } = require('../../config.json');
const fs = require('fs');

const create_details = 'Creates an rpg character and save its stats/inventory, ' +
    `the word \`${null_word}\` can be used to indicate that the stat isn\'t used (it can still be be edited afterwards)\n` +
    'You can use the option -f to replace an already existing character by typing \`!create -f\` instead of \`!create\`\n' +
    'The characteristics saved by the bot are :\n' +
    `   - The name of the character (can't use ${null_word}),\n` +
    '   - A profile image for the character,\n' +
    '   - The level of the character,\n' +
    '   - The age of the character,\n' +
    '   - The job of the character,\n' +
    '   - The amount of HP of the character,\n' +
    '   - The amount of MP of the character,\n' +
    '   - The alignment of the character\n' +
    '   - The proficiency of the character\n' +
    '   - The initiative of the character,\n' +
    '   - The attack of the character,\n' +
    '   - The defense of the character,\n' +
    '   - The money of the character,\n\n' +
    'The next characteristics must be entered this way:\n' +
    '\`value 1, value 2, value 3, etc\`\n\n' +
    '   - The traits of the character,\n' +
    '   - The skills of the character,\n' +
    '   - The spells of the character,\n' +
    '   - The names of the stats of the character\n' +
    '   - The corresponding values of the stats of the character (there must be an identical number of names and values)\n' +
    'The next characteristics must be entered this way:\n' +
    '\`name 1: value 1, name 2: value 2, name 3: value 3, etc\`\n' +
    'If one of the values is equal to 1 you can just put the name without the value, for example, if \`name 1\` has its value to 1 you could type:\n' +
    '\`name 1, name 2: value 2, name 3: value 3, etc\`\n\n' +
    '   - The inventory of the character\n';

module.exports = class Create extends Command {

    constructor(client){
        super(client, {
            name: 'create',
            group: 'rpg',
            memberName: 'create',
            aliases: ['c'],
            guildOnly: true,
            description:
                'Creates an rpg character and save its stats/inventory, ' +
                `the word \`${null_word}\` can be used to indicate that the stat isn\'t used (it can still be be edited afterwards)`,
            details:
                create_details,
            args: [
                {
                    key: 'options',
                    prompt: 'Do you want to replace a character?',
                    type: 'string',
                    default: '',
                    validate: options => options === '-f' || options === ''
                },
                {
                    key: 'name',
                    prompt: 'What\'s the name of your character?',
                    type: 'string',
                    wait: 90,
                    validate: name => name.length > 0
                },
                {
                    key: 'image',
                    prompt: 'What\s the profile image you want for your character?',
                    type: 'string',
                    wait: 300,
                    error: 'Image not found, please try again',
                    validate: image => image.match(/\.(jpeg|jpg|gif|png)$/) || image === null_word
                },
                {
                    key: 'levels',
                    prompt: 'How many levels does your character have?',
                    type: 'string',
                    wait: 90,
                    validate: levels => levels > 0 || levels === null_word
                },
                {
                    key: 'age',
                    prompt: 'What\'s the age of your character?',
                    type: 'string',
                    wait: 90,
                    validate: age => age > 0 || age === null_word
                },
                {
                    key: 'job',
                    prompt: 'What\'s the job of your character?',
                    type: 'string',
                    wait: 90,
                    validate: job => job.length > 0 || job === null_word
                },
                {
                    key: 'race',
                    prompt: 'What\'s the race of your character?',
                    type: 'string',
                    wait: 90,
                    validate: race => race.length > 0 || race === null_word
                },
                {
                    key: 'alignment',
                    prompt: 'What\'s the alignment of your character?',
                    type: 'string',
                    wait: 90,
                    validate: alignment => alignment === null_word || alignment.length > 0
                },
                {
                    key: 'proficiency',
                    prompt: 'What\'s the proficiency of your character?',
                    type: 'string',
                    wait: 90,
                    validate: proficiency => proficiency === null_word || proficiency >= 0
                },
                {
                    key: 'HP',
                    prompt: 'How much HP does your character have?',
                    type: 'string',
                    wait: 90,
                    validate: HP => HP > 0 || HP === null_word
                },
                {
                    key: 'MP',
                    prompt: 'How much MP does your character have?',
                    type: 'string',
                    wait: 90,
                    validate: MP => MP > 0 || MP === null_word
                },
                {
                    key: 'initiative',
                    prompt: 'How much initiative does your character have?',
                    type: 'string',
                    wait: 90,
                    validate: initiative => !isNaN(initiative) || initiative === null_word
                },
                {
                    key: 'attack',
                    prompt: 'How much attack does your character have?',
                    type: 'string',
                    wait: 90,
                    validate: attack => attack > 0 || attack === null_word
                },
                {
                    key: 'defense',
                    prompt: 'How much defense does your character have?',
                    type: 'string',
                    wait: 90,
                    validate: defense => defense > 0 || defense === null_word
                },
                {
                    key: 'money',
                    prompt: 'How much money does your character have?',
                    type: 'string',
                    wait: 90,
                },
                {
                    key: 'stats_names',
                    prompt: 'What are the names of the stats of your character?',
                    type: 'string',
                    wait: 300,
                    validate: stats_names => stats_names.split(' ').length > 0 || stats_names === null_word
                },
                {
                    key: 'stats',
                    prompt: 'What are the values of the stats of your character?',
                    type: 'string',
                    wait: 300,
                    validate: stats => stats.length > 0 || stats === null_word
                },
                {
                    key: 'traits',
                    prompt: 'What are the traits of your character?',
                    type: 'string',
                    wait: 300,
                    validate: stats_names => stats_names.split(' ').length > 0 || stats_names === null_word
                },
                {
                    key: 'inventory',
                    prompt: 'What does your character own?',
                    type: 'string',
                    wait: 300,
                    validate: inventory => inventory.length > 0 || inventory === null_word
                },
                {
                    key: 'skills',
                    prompt: 'What are the skills of you character?',
                    type: 'string',
                    wait: 300,
                    validate: skills => skills.length > 0 || skills === null_word
                },
                {
                    key: 'spells',
                    prompt: 'What are the spells of you character?',
                    type: 'string',
                    wait: 300,
                    validate: spells => spells.length > 0 || spells === null_word
                }
            ]
        });
    }

    async run(message, {
                  options, name,image,
                  levels, age, job, race, HP, MP, initiative, attack, defense, money,
                  traits, stats_names, stats, inventory, skills, spells, alignment, proficiency
    }) {
        const path = `${process.cwd()}/characters/${message.guild.name}/${name}.json`;

        try {
            if (fs.accessSync(path)) {
                message.reply('This character already exists! To replace it, use replace command').then();
                return;
            }
        } catch (e) {
            console.error(e);
        }

        if (stats_names.split(' ').length !== stats.split(' ').length) {
            message.reply('There isn\'t the same number of stats and values!').then();
            return;
        }
        else if (stats_names === null_word && stats !== null_word) {
            message.reply(`The stats names are marked as ${null_word} but not the stats`).then();
            return;
        }
        else if (stats_names !== null_word && stats === null_word) {
            message.reply(`The stats are marked as ${null_word} but not the stats names`).then();
            return;
        }

        let obj = {
            'name': name,
            'image': image,
            'HP': HP,
            'base_HP': HP,
            'MP': MP,
            'levels': levels,
            'age': age,
            'job': job,
            'race': race,
            'money': money,
            'initiative': initiative,
            'attack': attack,
            'defense': defense,
            'alignment': alignment,
            'proficiency': proficiency,
            'traits': [],
            'stats': [],
            'inventory': [],
            'skills': [],
            'spells': []
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
            character.addField('HP: ', `${HP}/${HP}`, true);
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

        if (alignement !== null_word)
            character.addField('alignment: ', alignement, true);

        if (traits !== null_word) {
            character.addField('\u200B', '\u200B');

            traits = traits.split(', ');
            let trait = '';
            for (let i = 0; i < traits.length - 1; i++)
                trait += `${traits[i]}\n`;
            if (traits.length > 0)
                trait += `${traits[traits.length - 1]}`;
            character.addField('Traits:', trait, true);
        }
        obj.traits = traits;

        if (skills !== null_word) {
            skills = skills.split(', ');

            if (traits === null_word)
                character.addField('\u200B', '\u200B');

            let skill = '';
            for (let i = 0; i < skills.length - 1; i++)
                skill += `${skills[i]}\n`;
            if (skills.length > 0)
                skill += `${skills[skills.length - 1]}`;
            character.addField('Skills:', skill, true);
        }
        obj.skills = skills;

        if (spells !== null_word) {
            if (spells.startsWith('niveau') || spells.startsWith('level') || spells.startsWith('lv') || spells.startsWith('nv')) {
                spells = spells.split('\n');

                if (traits === null_word && skills === null_word)
                    character.addField('\u200B', '\u200B');

                character.addField('Spells:', '\u200B');

                for (let i = 0; i < spells.length; i++) {
                    let spell = spells[i].split(': ');
                    const spell_lv = spell[0];
                    const sp = spell[1].split(', ').sort().join(', ');

                    character.addField(spell_lv, sp);
                }
            } else {
                spells = spells.split(', ').sort();

                if (traits === null_word && skills === null_word)
                    character.addField('\u200B', '\u200B');

                let spell = '';
                for (let i = 0; i < spells.length - 1; i++)
                    spell += `${spells[i]}\n`;
                if (spells.length > 0)
                    spell += `${spells[spells.length - 1]}`;
                character.addField('Spells:', spell, true);
            }
        }
        obj.spells = spells;

        if (stats !== null_word) {
            character.addField('\u200B', '\u200B');

            let stat = '';
            const s_names = stats_names.split(', ');
            const stats_values = stats.split(', ');

            for (let i = 0; i < s_names.length; i++) {
                let o = {};
                o[s_names[i].replace('_', ' ')] = stats_values[i];
                obj.stats.push(o);

                stat += `${s_names[i].replace('_', ' ')}: ${stats_values[i]}`;
            }

            character.addField('Stats:', stat, true);
        } else obj.stats = null_word;

        if (inventory !== null_word) {
            if (stats === null_word)
                character.addField('\u200B', '\u200B', false);

            let invent = '';
            const inventory_obj = inventory.split(', ').sort();

            for (let i = 0; i < inventory_obj.length; i++) {
                const object = inventory_obj[i].split(': ');
                let o = {};
                o[object[0].replace('_', ' ')] = object.length === 1 ? 1 : object[1];
                obj.inventory.push(o)

                invent += `${object[0].replace('_', ' ')}: ${o[object[0]]}`;
            }

            character.addField('Inventory :', invent, true);
        } else obj.inventory = null_word;

        try {
            fs.accessSync(`${process.cwd()}/characters/${message.guild.name}`)
        } catch (e) {
            console.error(e);
            fs.mkdirSync(`${process.cwd()}/characters/${message.guild.name}`);
        }

        if (options === '-f')
            try {
                if (fs.accessSync(path))
                    fs.unlinkSync(path);
            } catch (e) {
                console.error(e);
            }
        else
            try {
                fs.accessSync(path);
            } catch (e) {
                console.error(e);
                message.reply('This character already exists\nTry using the -f option to overwrite it.').then();
            }

        await fs.writeFileSync(
            `${process.cwd()}/characters/${message.guild.name}/${name}.json`, JSON.stringify(obj));

        await message.channel.send({ embed: character });
    }
}
