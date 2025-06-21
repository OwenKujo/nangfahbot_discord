const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // The data object is required by djs-commander for slash commands
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    // The run function is executed when the command is used
    async execute(interaction) {
        await interaction.reply({ content: 'Pong!', ephemeral: true });
    },
};