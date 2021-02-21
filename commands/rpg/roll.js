const { author_id, token } = require('../../config.json')
const { success, failure } = require('../../resources.json')
const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class ReloadCommand extends Command {

    constructor(client){
        super(client, {
            name: 'roll',
            group: 'rpg',
            memberName: 'roll',
            aliases: ['dice'],
            description: 'roll a dice with a specified number of faces',
            usage: '[faces] {rolls}',
            args: [
                {
                    key: 'faces',
                    prompt: 'How many faces?',
                    type: 'integer',
                    validate: function(facesNumber) {
                        return facesNumber > 1;
                    }
                },
                {
                    key: 'rollNumber',
                    prompt: 'How many rolls?',
                    default: 1,
                    type: 'integer',
                    validate: function (rollNumber) {
                        return rollNumber > 0;
                    }
                }]
        });
    }

    async run(message, { faces, rollNumber }){

        let rnd;
        let rollResults = new MessageEmbed()
            .setColor('#172fc9')
            .setTitle(`${message.author.username}, you rolled:`)

        let nbFail = 0,
            nbWin = 0;

        let rolls = "";
        let total = 0;

        for (let i = 0; i < rollNumber; i++) {
            console.log(i)

            rnd = Math.floor(Math.random() * faces + 1);
            total += rnd;

            if (rnd == faces) {
                rolls += `Roll n°${i + 1}: ${rnd.toString()}, réussite critique\n`;
                nbWin++;
            } else if (rnd == 1) {
                rolls += `Roll n°${i + 1}: ${rnd.toString()}, échec critique\n`;
                nbFail++;
            } else
                rolls += `Roll n°${i + 1}: ${rnd.toString()}\n`;
        }

        rollResults.addField('Rolls:\t\t', rolls, true);

        if (nbFail < nbWin) {
            rollResults.setImage(this.random_item(success));
        }
        else if (nbFail > nbWin) {
            rollResults.setImage(this.random_item(failure));
        }

        if (rollNumber > 1)
            rollResults.addField('Total:', total, true);

        await message.channel.send({ embed: rollResults });
    }

    random_item(items){
        return items[Math.floor(Math.random() * items.length)];
    }
}
