import { Interaction, Permissions, GuildMember } from 'discord.js';
import { guildHandler } from '../index.js';
import type { Client } from '../../index';

export default {
    name: "interactionCreate",
    once: false,
    execute: (interaction: Interaction, client: Client) => {


        // console.log(guildHandler.guildContents);

        /**
         * Getting the guild ID of where
         * the command was ran.
         */
        const guildID: string = interaction.member['guild'].id;

        /**
         * The member who ran the command.
         */
        const member = interaction.member as GuildMember;

        /**
         * If the interaction is not a 
         * slash command then we just return
         */
        if (!interaction.isCommand()) return;   
        let { permissions, channelStrict = false, run } = client.commandCollection.get(interaction.commandName).default;
        
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

        /**
         * Running the command;
         */
        return run(interaction);

    }
}