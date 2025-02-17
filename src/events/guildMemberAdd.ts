import { GuildMember, TextChannel } from 'discord.js';
import type { guild } from '../../index';
import type FuriaBot from '../struct/discord/client';

export default {
    name: "guildMemberAdd",
    once: false,
    execute: (member: GuildMember, client: FuriaBot) => {
        const guild: guild = client.guildHandler.guildContents.filter(item => item.guildID === member.guild.id)[0];
        if (guild?.welcome_c_id) {
            let welcomeMsg: string;
            welcomeMsg = guild?.welcome_msg
                ? guild?.welcome_msg.search(/<@>/g) ? guild?.welcome_msg.replace(/<@>/g, `<@${member.id}>`) : guild?.welcome_msg
                : `Welcome to **${guild.guildName}**, <@${member.id}>!`;

            const welcomeChannel = client.channels.cache.get(guild?.welcome_c_id) as TextChannel;
            welcomeChannel.send({
                embeds: [{
                    color: '#22c55e',
                    description: welcomeMsg
                }]
            })
            return;
        }
    }
}