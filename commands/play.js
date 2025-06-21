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
                return interaction.editReply({ content: 'Could not fetch track info from Spotify.' });
            }
        }
        console.log('Spotify/YouTube search query:', searchQuery);

        // If it's a YouTube link, pass it directly; otherwise, search YouTube
        let youtubeUrl = searchQuery;
        if (!/^https?:\/\/(www\.)?youtube\.com\/watch\?v=/.test(searchQuery) && !/^https?:\/\/youtu\.be\//.test(searchQuery)) {
            const result = await ytSearch(searchQuery);
            youtubeUrl = result.videos.length > 0 ? result.videos[0].url : null;
            console.log('YouTube URL found:', youtubeUrl);
            if (!youtubeUrl) {
                return interaction.editReply({ content: 'Could not find the track on YouTube.' });
            }
        } else {
            console.log('Direct YouTube URL:', youtubeUrl);
        }

        // Final check: Only pass valid YouTube URLs to DisTube
        if (!/^https?:\/\/(www\.)?youtube\.com\/watch\?v=/.test(youtubeUrl) && !/^https?:\/\/youtu\.be\//.test(youtubeUrl)) {
            console.error('Not a valid YouTube URL:', youtubeUrl);
            return interaction.editReply({ content: 'Internal error: Not a valid YouTube URL.' });
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
            await interaction.editReply({ content: 'There was an error trying to play that track.' });
        }
    },
}; 