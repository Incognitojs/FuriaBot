import { Interaction, Permissions, GuildMember } from 'discord.js';
import { guildHandler } from '../index.js';
import type { Client, guild } from '../../index';

export default {
    name: "interactionCreate",
    once: false,
    execute: (interaction: Interaction, client: Client) => {
        /**
         * Getting the guild ID of where
         * the command was ran.
         */
        const guildID: string = interaction.guild.id;
        /**
         * Current guild.
         */
        const guild: guild = guildHandler.guildContents.filter(item => item.guildID === guildID)[0];
        /**
         * The member who ran the command.
         */
        const member = interaction.member as GuildMember;

        /**
         * If the interaction is not a 
         * slash command then we just return
         */
        if (!interaction.isCommand()) return;   
        let { permissions, run } = client.commandCollection.get(interaction.commandName).default;
        /**
         * Checking if the user has the correct permissions.
         */
        if (permissions) {
            if (typeof permissions === "string") permissions = [permissions];
            for (const perm of permissions) {
                if (!member.permissions.has(perm))  
                    return interaction.reply(`You are lacking the permission: **${perm}**`);
            }
        }

        if (guild?.cmd_c_id && interaction.channel.id !== guild?.cmd_c_id)
            return interaction.reply(`Please use my commands in the correct channel. <#${guild.cmd_c_id}>`);

        
        /**
         * Running the command;
         */
        return run(interaction, guild);

    }
}