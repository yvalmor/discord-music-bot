const constants = require('../../constants.json');
const pdfDoc = require('pdfkit');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const { Command } = require('discord.js-commando');
const fs = require('fs');

module.exports = class Print extends Command {

    constructor(client){
        super(client, {
            name: 'print',
            group: 'rpg',
            memberName: 'print',
            ownerOnly: true,
            description: 'generates the pdf of a character sheet',
            aliases: ['generate'],
            args: [
                {
                    key: 'names',
                    type: 'string',
                    prompt: 'What are the names of the characters?',
                    wait: 180
                }
            ]
        });
    }

    run(message, { names}) {

        const files = names.split(', ');

        for (let fileName of files) {
            let file = fileName.replace('_', ' ');

            const path =
                `${process.cwd()}/characters/${message.guild.name}/${file}.json`;
            try {
                fs.existsSync(path)
            } catch (e) {
                console.error(e);
                message.reply(`The character \`${file}\` doesn't exists!`).then();
                return;
            }

            const character = require(path);

            const {
                HP, alignment, base_HP, initiative,
                inventory, job, levels, money, name, proficiency,
                race, skills, spells, stats, traits
            } = character;

            let doc = new pdfDoc({
                size: [1449, 2048]
            });

            doc.pipe(fs.createWriteStream(`./${file}.pdf`));

            doc.image('sheet.png', 0, 0, {});

            doc.fillColor('#3B5B8B')
                .text(name, 150, 200, {
                    width: 179,
                    height: 113
                });

            doc.save()
                .end();

            message.reply({
                files: [
                    `./${file}.pdf`
                ]
                })
                .catch(e => console.error(e))
                .then(fs.unlinkSync(`./${file}.pdf`));
        }
    }
}