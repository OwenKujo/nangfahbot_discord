module.exports = {
    // The data object is required by djs-commander for slash commands
    data: {
        name: 'ping',
        description: 'Replies with Pong! to check if the bot is running.',
    },
    // The run function is executed when the command is used
    run: ({ interaction, client, handler }) => {
        interaction.reply('Pong!');
    },
};