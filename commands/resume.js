const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the currently paused music'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction.guildId);
        if (!queue) {
            await interaction.reply({ content: 'There is no music playing!', ephemeral: true });
            return;
        }
        queue.resume();
        await interaction.reply({ content: '▶️ Resumed the music.' });
    },
}; 