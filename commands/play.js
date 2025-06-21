const { SlashCommandBuilder } = require('discord.js');
const { DisTube } = require('distube');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from Spotify or YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Spotify/YouTube link or search term')
                .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
        }
        try {
            const distube = interaction.client.distube;
            await distube.play(voiceChannel, query, {
                textChannel: interaction.channel,
                member: interaction.member
            });
            await interaction.reply({ content: `Searching and playing: ${query}` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error trying to play that track.', ephemeral: true });
        }
    },
}; 