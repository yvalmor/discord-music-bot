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
                        console.log("times okay");
                        return times > 0;
                    }
                },
                {
                    key: 'Users',
                    prompt:
                        'Who do you want to spam ?',
                    type: 'string',
                    validate: function (userString) {
                        if (userString === "") {
                            console.log("userString not okay");
                            return false;
                        }

                        let users = userString.split(' ');

                        for (let i = 0; i < users.length; i++){
                            if (client.users.array().find(user => users.includes(user.username)) == null)
                            {
                                console.log(`username ${users[i]} not okay`);
                                return false;
                            }
                        }

                        console.log("usernames okay");
                        return true;
                    }
                },
                {
                    key: 'Message',
                    prompt: 'What message do you want to send them?',
                    type: 'string',
                    validate: function (string) {
                        if (string === "")
                            console.log("message not okay");

                        return string === "";
                    }
                }
            ]
        });
    }

    run(message, { times, userString, spamMessage }) {
        console.log(`spamming ${userString} ${times} times`)

        if (message.author.id !== author_id && !authorised_ids.includes(message.author))
            return message.reply("You're not authorised to use this command!")

        const usernames = userString.split(' ');
        const guild_users = [];

        message.guild.members.forEach(member => guild_users.push(member.user.username));

        const users = guild_users.filter(user => usernames.includes(user.username));

        const toSend = `<@${message.author.id}> would like to tell you this:\n` + spamMessage;

        for (let i = 0; i < times; i++)
            users.forEach(user => user.send(toSend))

    }
}