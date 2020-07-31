const { author_id, authorised_ids } = require('../../config.json')
const { Command } = require('discord.js-commando');

module.exports = class SpamCommand extends Command {

    constructor(client){
        super(client, {
            name: 'spam',
            group: 'other',
            memberName: 'spam',
            description: 'spam someone',
            usage: '[nb of times] [users] [message]',
            args: [
                {
                    key: 'times',
                    prompt:
                        'how many times do you want to spam them ?',
                    type: 'integer',
                    validate: function (times) {
                        return times > 0;
                    }
                },
                {
                    key: 'userString',
                    prompt:
                        'Who do you want to spam ?',
                    type: 'string',
                    validate: function (userString) {
                        if (userString === "")
                            return false;

                        let users = userString.split(' ');

                        for (let i = 0; i < users.length; i++){
                            if (client.users.cache.find(user => users.includes(user.username)) == null)
                                return false;
                        }

                        return true;
                    }
                },
                {
                    key: 'spamMessage',
                    prompt: 'What message do you want to send them?',
                    type: 'string',
                }
            ]
        });
    }

    run = (message, { times, userString, spamMessage }) => {
        console.log(`spamming ${userString} ${times} times`)

        if (message.author.id !== author_id && !authorised_ids.includes(message.author.id))
            return message.reply("You're not authorised to use this command!")

        const usernames = userString.toLowerCase().split(' ');

        let users = [];

        for (let i = 0; i < usernames.length; i++)
            users.push(message.client.users.cache.find(
                user => usernames.includes(user.username.toLowerCase()) && !users.find(u => u.username === user.username)))

        message.reply("Beginning spam")

        for (let i = 0; i < users.length; i++)
            users[i].send(`<@${message.author.id}> would like to tell you this:`);

        for (let j = 0; j < users.length; j++)
        for (let i = 0; i < times; i++)
            users[j].send(`<@${users[j].id}> ${spamMessage}`);
    };
}