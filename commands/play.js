const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from Spotify, YouTube, or a search term')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Spotify/YouTube link or search term')
                .setRequired(true)),
    async execute(interaction) {
        const query = interaction.options.getString('query');
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            await interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
            return;
        }
        await interaction.deferReply();
        try {
            const distube = interaction.client.distube;
            await distube.play(voiceChannel, query, {
                textChannel: interaction.channel,
                member: interaction.member
            });
            await interaction.editReply({ content: `Searching and playing: ${query}` });
        } catch (error) {
            console.error('DisTube play error:', error);
            await interaction.editReply({ content: 'There was an error trying to play that track.' });
        }
    },
}; 