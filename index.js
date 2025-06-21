require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { execSync } = require('child_process');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // Required for the welcome event
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates, // Required for voice features
    ],
});

// --- Command Handling ---
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`[SUCCESS] Loaded command: ${command.data.name}`);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// --- Event Handling ---
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`[SUCCESS] Loaded event: ${event.name}`);
}

// Initialize DisTube and attach to client
client.distube = new DisTube(client, {
    plugins: [new SpotifyPlugin()],
    // ffmpeg: process.env.FFMPEG_PATH, // Only if DisTube supports this option
});

// Optional: Log DisTube events for debugging
client.distube.on('error', (channel, error) => {
    console.error('DisTube Error:', error);
    if (channel) channel.send('DisTube Error: ' + error.message);
});
client.distube.on('finish', queue => {
    console.log('Finished playing in', queue.voice.channel.name);
});

// --- Slash Command Execution ---
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Bot is in ${client.guilds.cache.size} servers`);
});

process.env.FFMPEG_PATH = './ffmpeg';

try {
    const ffmpegVersion = execSync('./ffmpeg -version').toString();
    console.log('FFmpeg version:', ffmpegVersion);
} catch (e) {
    console.error('FFmpeg not found or not executable:', e);
}

client.login(process.env.DISCORD_CLIENT);

