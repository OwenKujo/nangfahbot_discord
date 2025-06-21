const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the current music queue'),
    async execute(interaction) {
        const queue = interaction.client.distube.getQueue(interaction.guildId);
        if (!queue) {
            await interaction.reply({ content: 'There is no music playing!', ephemeral: true });
            return;
        }
        queue.shuffle();
        await interaction.reply({ content: '🔀 Shuffled the queue.' });
    },
}; 