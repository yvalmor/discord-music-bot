const { author_id, token } = require('../../config.json')
const { success, failure } = require('../../resources.json')
const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class ReloadCommand extends Command {

    constructor(client){
        super(client, {
            name: 'roll',
            group: 'dice',
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

    run(message, { faces, rollNumber }){
        let rnd;
        let rollResults = new MessageEmbed()
            .setColor('#172fc9')
            .setTitle(`${message.author}, you rolled:`)

        let nbFail = 0,
            nbWin = 0;

        for (let i = 0; i < rollNumber; i++) {
            rnd = Math.floor(Math.random() * faces + 1);

            if (rnd == faces) {
                rollResults.addField(`Roll n°${i}`, `${rnd.toString()}, réussite critique`);
                nbWin++;
            } else if (rnd == 1) {
                rollResults.addField(`Roll n°${i}`, `${rnd.toString()}, échec critique`);
                nbFail++;
            } else
                rollResults.addField(`Roll n°${i}`, `${rnd.toString()}`)
        }

        if (nbFail < nbWin)
            rollResults.setImage(this.random_item(failure))
        else if (nbFail !== nbWin)
            rollResults.setImage(this.random_item(success))
    }

    random_item(items){
        return items[Math.floor(Math.random() * items.length)];
    }
}