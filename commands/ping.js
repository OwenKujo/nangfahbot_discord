module.exports = {
    data:{
        name: 'ping',
        description: 'Reply  with Pong',
    },
    run : ({ interaction }) => {
        interaction.reply("Pong!!").catch(console.error);
    }
}