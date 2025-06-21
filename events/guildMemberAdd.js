const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    execute(member) {
        // Get the guild (server) the member joined
        const guild = member.guild;
        
        // You can customize this channel ID - replace with your welcome channel ID
        // To get the channel ID: Right-click the channel and select "Copy ID" (Developer Mode must be enabled)
        const welcomeChannelId = process.env.WELCOME_ID; // Replace this with your actual channel ID
        
        const welcomeChannel = guild.channels.cache.get(welcomeChannelId);
        
        if (!welcomeChannel) {
            console.log('Welcome channel not found. Please set the correct channel ID.');
            return;
        }

        // Create a welcome embed
        const welcomeEmbed = new EmbedBuilder()
            .setColor('#00ff00') // Green color
            .setTitle('🎉 Welcome to the Server!')
            .setDescription(`Wagwan! ${member.user.username}, welcome to our yard**${guild.name}**!`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '👤 Member Count', value: `${guild.memberCount}`, inline: true },
                { name: '📅 Joined', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
            )
            .setFooter({ text: 'We hope you enjoy your stay!' })
            .setTimestamp();

        // Send the welcome message
        welcomeChannel.send({ embeds: [welcomeEmbed] })
            .then(() => {
                console.log(`Welcome message sent for ${member.user.tag}`);
            })
            .catch(error => {
                console.error('Error sending welcome message:', error);
            });
    },
}; 