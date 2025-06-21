const { SlashCommandBuilder } = require('discord.js');
const ytSearch = require('yt-search');
const { getTrackInfo } = require('../spotify'); // Adjust path as needed

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
        await interaction.deferReply();
        let searchQuery = query;
        if (query.includes('open.spotify.com/track')) {
            searchQuery = await getTrackInfo(query);
            if (!searchQuery) {
                return interaction.reply({ content: 'Could not fetch track info from Spotify.', ephemeral: true });
            }
        }
        // Now search YouTube for the track
        const result = await ytSearch(searchQuery);
        const youtubeUrl = result.videos.length > 0 ? result.videos[0].url : null;
        if (!youtubeUrl) {
            return interaction.reply({ content: 'Could not find the track on YouTube.', ephemeral: true });
        }
        try {
            const distube = interaction.client.distube;
            await distube.play(voiceChannel, youtubeUrl, {
                textChannel: interaction.channel,
                member: interaction.member
            });
            await interaction.editReply({ content: `Now playing: ${searchQuery}` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error trying to play that track.', ephemeral: true });
        }
    },
}; 