import { GuildMember, Client, TextChannel } from 'discord.js';
import { guildHandler } from '../index.js';
import type { guild } from '../../index';

export default {
    name: "guildMemberRemove",
    once: false,
    execute: (member: GuildMember, client: Client) => {
        const guild: guild = guildHandler.guildContents.filter(item => item.guildID === member.guild.id)[0];

        let leaveMsg: string;

        if (guild?.welcome_c_id) {
            leaveMsg = guild?.leave_msg
                ? guild?.leave_msg.search(/<@>/g) ? guild?.leave_msg.replace(/<@>/g, `<@${member.id}>`) : guild?.leave_msg
                : `[-] <@${member.id}>`;

            const welcomeChannel = client.channels.cache.get(guild?.welcome_c_id) as TextChannel;
            welcomeChannel.send({
                embeds: [{
                    color: '#ef4444',
                    description: leaveMsg
                }]
            })
            return;
        }
    }
}