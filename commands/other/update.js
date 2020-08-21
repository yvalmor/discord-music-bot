const { author_id } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class Update extends Command {
    constructor(client) {
        super(client, {
            name: 'update',
            group: 'other',
            memberName: 'update',
            hidden: true,
        });
    }

    run(message) {
        const url = 'https://github.com/yvalmor/SpellManager'

        let update = new MessageEmbed()
            .setTitle('Spell Manager')
            .setDescription('A new version of the Spell Manager has been released!')
            .setAuthor('Yvon', message.author.avatarURL(), url)
            .setColor('#0000ff')
            .addFields(
                { name: 'MacOS:', text: `${url}/releases/latest/download/Spell_manager-mac.zip`},
                { name: 'Linux:', text: `${url}/releases/latest/download/Spell_manager-linux.tar.gz`},
                { name: 'MacOS:', text: `${url}/releases/latest/download/Spell_manager.-.windows.exe`},
            );

        message.reply('Sending update!').then();

        const channel = this.client.channels.cache.get('746280899951198249').send(update);
    }
}