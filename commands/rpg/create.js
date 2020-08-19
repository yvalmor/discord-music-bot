const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class Create extends Command {

    constructor(client){
        super(client, {
            name: 'create',
            group: 'rpg',
            memberName: 'create',
            aliases: ['c'],
            description: 'Creates an rpg character and save its stats/inventory',
            usage: '[name] [stats] {inventory}',
            args: [
                {
                    key: 'name',
                    prompt: 'What\'s the name of the character?',
                    type: 'string',
                    wait: 90,
                    validate: function(name) {
                        return name.length > 3;
                    }
                },
                {
                    key: 'image',
                    prompt: 'What\s the profile image you want for your character? (send \`empty\` for no image)',
                    type: 'string',
                    wait: 300,
                    error: 'Image not found, please try again',
                },
                {
                    key: 'HP',
                    prompt: 'How much HP does the character have?',
                    type: 'integer',
                    wait: 90,
                    validate: function(hp) {
                        return hp > 0;
                    }
                },
                {
                    key: 'MP',
                    prompt: 'How much MP does the character have?',
                    type: 'integer',
                    wait: 90,
                    validate: function(mp) {
                        return mp > 0;
                    }
                },
                {
                    key: 'stats_names',
                    prompt: 'What are the names of the stats?',
                    type: 'string',
                    wait: 300,
                    validate: function (stats_names) {
                        return stats_names.split(' ').length > 0;
                    }
                },
                {
                    key: 'stats',
                    prompt: 'What are the values of the stats?',
                    type: 'string',
                    wait: 300,
                    validate: function (stats) {
                        return stats.length > 0;
                    }
                },
                {
                    key: 'inventory',
                    prompt: 'What does the character own? (send \`empty\` for no inventory)',
                    type: 'string',
                    wait: 300
                }]
        });
    }

    async run(message,
              { name,HP, MP, image, stats_names, stats, inventory }) {
        if (stats_names.split(' ').length !== stats.split(' ').length) {
            message.reply("there isn't the same number of stats and values!").then();
            return;
        }

        let character = new MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(`Name: ${name}      HP: ${HP}      MP: ${MP}`)
            .setTitle('Stats :');

        if (image !== 'empty')
            character.setThumbnail(image);

        let obj = {
            'name': name,
            'HP': HP,
            'MP': MP,
            'stats': [],
            'inventory': []
        };

        const s_names = stats_names.split(' ');
        const stats_values = stats.split(' ');

        for (let i = 0; i < s_names.length; i++) {
            let o = {};
            o[s_names[i]] = stats_values[i];
            obj.stats.push(o);

            character.addField(`${s_names[i]} :      `, stats_values[i], true)
        }

        if (inventory !== 'empty') {
            character.addField('\u200B', '\u200B', false);
            character.addField('Inventory :', '\u200B', false);

            const inventory_obj = inventory.split(', ');
            for (let i = 0; i < inventory_obj.length; i++) {
                const object = inventory_obj[i].split(': ');
                let o = {};
                o[object[0]] = object.length === 1 ? 1 : object[1];
                obj.inventory.push(o)

                character.addField(`${object[0]} :      `, o[object[0]], true)
            }
        }

        if (!fs.access(`./characters/${message.guild.name}`, (err => console.log(err))))
           await fs.mkdir(`./characters/${message.guild.name}`, true, (err => console.log(err)))

        const path = `./characters/${message.guild.name}/${name}.json`;

        fs.writeFile(path, JSON.stringify(obj), (err) => {
            if (err) console.error(err);
        });

        await message.channel.send({ embed: character });
    }
}