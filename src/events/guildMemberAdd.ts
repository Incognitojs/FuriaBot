import { GuildMember, Client, TextChannel } from 'discord.js';
import { guildHandler } from '../index.js';

import type { guild } from '../../index';

export default {
    name: "guildMemberAdd",
    once: false,
    execute: (member: GuildMember, client: Client) => {
        const guild: guild = guildHandler.guildContents.filter(item => item.guildID === member.guild.id)[0];

        let welcomeMsg: string;

        if (guild?.welcome_c_id) {
            welcomeMsg = guild?.welcome_msg
                ? guild?.welcome_msg
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