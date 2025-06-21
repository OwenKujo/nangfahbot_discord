require('dotenv').config();
const {Client, GatewayIntentBits} = require('discord.js');
const {commandHandler, CommandHandler} = require('djs-commander');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

try {
    new CommandHandler({
        client,
        eventsPath: path.join(__dirname, 'events'),
        commandsPath: path.join(__dirname, 'commands')
    });
} catch (error) {
    console.error('Error initializing CommandHandler:', error);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Bot is in ${client.guilds.cache.size} servers`);
});

client.login(process.env.DISCORD_CLIENT);

