const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the currently playing song'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction.guildId);
        if (!queue) {
            await interaction.reply({ content: 'There is no music playing!', ephemeral: true });
            return;
        }
        try {
            await queue.skip();
            await interaction.reply({ content: '⏭️ Skipped the song.' });
        } catch (error) {
            await interaction.reply({ content: 'There is no next song to skip to!', ephemeral: true });
        }
    },
}; 