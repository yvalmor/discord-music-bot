const { MessageEmbed } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class Damage extends Command {
    constructor(client) {
        super(client, {
            name: 'damage',
            group: 'other',
            memberName: 'damage',
            description: 'Sends an update',
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
            .addField('MacOS:',
                'link: [Spell_manager-mac.zip](https://github.com/yvalmor/SpellManager/releases/latest/download/Spell_manager-mac.zip)')
            .addField('Linux:',
                'link: [Spell_manager-linux.tar.gz](https://github.com/yvalmor/SpellManager/releases/latest/download/Spell_manager-linux.tar.gz)')
            .addField('MacOS:',
                'link: [Spell_manager-windows.exe](https://github.com/yvalmor/SpellManager/releases/latest/download/Spell_manager.-.windows.exe)');


        message.reply('Sending update!').then();

        this.client.channels.cache.get('746280899951198249').send(update);
    }
}