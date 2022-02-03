import { Interaction, Permissions } from 'discord.js';
import { readFile } from 'fs/promises';
import type { Client } from '../../index';

export default {
    name: "interactionCreate",
    once: false,
    execute: (interaction: Interaction, client: Client) => {

        /**
         * Getting the guild ID of where
         * the command was ran.
         */
        const guildID: string = interaction.member['guild'].id;

        if (!interaction.isCommand()) return;

        let { permissions, channelStrict = false, run } = client.commandCollection.get(interaction.commandName).default;
        
        return run(interaction);

    }
}