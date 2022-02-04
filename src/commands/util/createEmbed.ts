import { SlashCommandBuilder as Command } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default {
    channelStrict: false,
    permissions: ["ADMINISTRATOR"],
    data: new Command()
        .setName("embed")
        .setDescription("Create a new embed for a channel."),

    run: (interaction: CommandInteraction) => {

        interaction.reply({
            embeds: [{
                description: "embed command ran succesfully."
            }]
        })

    }
}