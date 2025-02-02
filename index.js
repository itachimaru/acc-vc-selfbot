const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');

// Initialize the client
const client = new Client({ checkUpdate: false });

// Get configuration from environment variables
const token = process.env.DISCORD_TOKEN;
const guildId = process.env.DISCORD_GUILD;
const channelId = process.env.DISCORD_CHANNEL;

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await joinVC(client, guildId, channelId);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const oldVoice = oldState.channelId;
    const newVoice = newState.channelId;

    if (oldVoice !== newVoice) {
        if (!oldVoice) {
            // empty
        } else if (!newVoice) {
            if (oldState.member.id !== client.user.id) return;
            await joinVC(client, guildId, channelId);
        } else {
            if (oldState.member.id !== client.user.id) return;
            if (newVoice !== channelId) {
                await joinVC(client, guildId, channelId);
            }
        }
    }
});

// Log in using the token from environment variable
client.login(token);

async function joinVC(client, guildId, channelId) {
    const guild = client.guilds.cache.get(guildId);
    const voiceChannel = guild.channels.cache.get(channelId);
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: true
    });
}
