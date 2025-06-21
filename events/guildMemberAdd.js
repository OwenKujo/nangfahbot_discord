const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    execute(member) {
        console.log(`New member joined: ${member.user.tag}`);
        
        // Get the guild (server) the member joined
        const guild = member.guild;
        
        // Try to get channel ID from environment variable first, then fallback to hardcoded
        const welcomeChannelId = process.env.WELCOME_ID || '843677406174642206';
        
        console.log(`Looking for channel with ID: ${welcomeChannelId}`);
        
        const welcomeChannel = guild.channels.cache.get(welcomeChannelId);
        
        if (!welcomeChannel) {
            console.log('Welcome channel not found. Available channels:');
            guild.channels.cache.forEach(channel => {
                if (channel.type === 0) { // Text channels only
                    console.log(`- ${channel.name}: ${channel.id}`);
                }
            });
            return;
        }

        console.log(`Found welcome channel: ${welcomeChannel.name}`);

        // Create a welcome embed
        const welcomeEmbed = new EmbedBuilder()
            .setColor('#00ff00') // Green color
            .setTitle('🎉 Welcome to the Server!')
            .setDescription(`Wagwan! ${member.user.username}, welcome to our yard **${guild.name}**!`)
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
                console.log(`✅ Welcome message sent for ${member.user.tag} in #${welcomeChannel.name}`);
            })
            .catch(error => {
                console.error('❌ Error sending welcome message:', error);
            });

        // Optional: Send a DM to the new member
        member.send(`Welcome to **${guild.name}**! We're glad to have you here! 🎉`)
            .then(() => {
                console.log(`✅ DM sent to ${member.user.tag}`);
            })
            .catch(error => {
                // DM might fail if user has DMs disabled, which is normal
                console.log(`⚠️ Could not send DM to ${member.user.tag}: ${error.message}`);
            });
    },
}; 