const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the currently playing music'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction.guildId);
        if (!queue) {
            await interaction.reply({ content: 'There is no music playing!', ephemeral: true });
            return;
        }
        queue.pause();
        await interaction.reply({ content: '⏸️ Paused the music.' });
    },
}; 