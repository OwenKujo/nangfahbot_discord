const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    execute(member) {
        console.log(`[EVENT] GuildMemberAdd: Fired for user ${member.user.tag}`);

        const guild = member.guild;
        const welcomeChannelId = process.env.WELCOME_ID || '843677406174642206';

        if (!welcomeChannelId) {
            console.error('[ERROR] Welcome channel ID is not set. Please set WELCOME_ID in your environment variables.');
            return;
        }

        const welcomeChannel = guild.channels.cache.get(welcomeChannelId);

        if (!welcomeChannel) {
            console.error(`[ERROR] Welcome channel with ID ${welcomeChannelId} not found.`);
            return;
        }

        const welcomeEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('🎉 Welcome to the Server!')
            .setDescription(`Wagwan! ${member.user.username}, welcome to our yard **${guild.name}**!`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '👤 Member Count', value: `${guild.memberCount}`, inline: true },
                { name: '📅 Joined', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
            )
            .setFooter({ text: 'We hope you enjoy your stay!' })
            .setTimestamp();

        // Send the welcome message with a ping in the content field for a reliable notification
        welcomeChannel.send({
            content: `Welcome <@${member.id}>!`,
            embeds: [welcomeEmbed]
        })
            .then(() => {
                console.log(`[SUCCESS] Welcome message sent for ${member.user.tag} in #${welcomeChannel.name}`);
            })
            .catch(error => {
                console.error(`[FATAL] Could not send welcome message to #${welcomeChannel.name}.`, error);
            });

        // Optional: Send a DM to the new member
        member.send(`Welcome to **${guild.name}**! We're glad you join our yard mate! 🎉`)
            .then(() => {
                console.log(`✅ DM sent to ${member.user.tag}`);
            })
            .catch(error => {
                // DM might fail if user has DMs disabled, which is normal
                console.log(`⚠️ Could not send DM to ${member.user.tag}: ${error.message}`);
            });
    },
}; 