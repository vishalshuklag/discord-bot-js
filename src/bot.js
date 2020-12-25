// https://discordjs.guide/
require('dotenv').config();

const { Client, WebhookClient } = require('discord.js');

const client = new Client({
    partials : ['MESSAGE', 'REACTION']
});
const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN
)

const PREFIX = '$';
// when the client is ready, run this code
// this event will only trigger one time after logging in
client.on('ready', () => {
    console.log(`Logged in as : ${client.user.tag}`);
})

// Emitted whenever a message is created.
client.on('message', async message => {
    if(message.author.bot) return;
    // console.log(`[${message.author.tag}] : ${message.content}`);
    if(message.content === 'Hello'){
    // Replies to the message.
    message.reply(`Hello ${message.author.tag}`);
    // .channel => The channel that the message was sent in
    message.channel.send(`Hello ${message.author.tag}`);
    }

    if(message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);
        // console.log(CMD_NAME);
        // console.log(args);
        
        // KICK COMMAND
        if (CMD_NAME === 'kick') {
            if (!message.member.hasPermission('KICK_MEMBERS')) {
                return message.reply('You do not have permission to use this command')
            }
            const user = message.mentions.users.first();
            if (user) {
            const member = message.guild.member(user);
            if (member) {
                /**
                 * Kick the member
                 * Make sure you run this on a member, not a user!
                 * There are big differences between a user and a member
                 */
                member
                .kick('Optional reason that will display in the audit logs')
                .then(() => {
                    // We let the message author know we were able to kick the person
                    message.reply(`Successfully kicked ${user.tag}`);
                })
                .catch(err => {
                    // An error happened
                    // This is generally due to the bot not being able to kick the member,
                    // either due to missing permissions or role hierarchy
                    message.reply('I was unable to kick the member');
                    console.error(err);
                });
            } else {
                // The mentioned user isn't in this guild
                message.reply("That user isn't in this guild!");
            }
            // Otherwise, if no user was mentioned
            } else {
            message.reply("You didn't mention the user to kick!");
            }
        } 
        // BAN COMMAND
        else if (CMD_NAME === 'ban') {
            // message.reply('Hello')
            if (!message.member.hasPermission('BAN_MEMBERS')) {
                return message.reply('You do not have permission to use this command')
            }
            // const user = message.mentions.users.first();
            if (args.length === 0) return message.reply('Please provide an ID.');
            // console.log(args);
            try {
                const user = await message.guild.members.ban(args[0]);
                // console.log(user);
                message.channel.send(`User was banned successfully !`)
            } catch (error) {
                message.reply('Soory ! I Was unable to ban the member')
                console.log(error.message);
            }
        }
        // WEBHOOK ANNOOUNCE
        else if (CMD_NAME === 'announce') {
            const msg = args.join(' ');
            webhookClient.send(msg);
        }
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    const {name} = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);

    if (reaction.message.id == '792133466664730674') {
        switch(name) {
            case '🍎':
                member.roles.add('792138189011025960')
                break;
            case '🍌':
                member.roles.add('792138386869452808')
                break;
            case '🍇':
                member.roles.add('792138557589946389')
                break;
            case '🍍':
                member.roles.add('792138678939156540')
            break;
        }
    }
})

client.login(process.env.DISCORD_BOT_TOKEN);