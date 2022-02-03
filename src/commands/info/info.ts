import { SlashCommandBuilder as Command } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default {
    channelStrict: false,
    data: new Command()
        .setName("info")
        .setDescription("General Information."),

    run: (interaction: CommandInteraction) => interaction.reply({
        embeds: [{
            description: "Information command ran succesfully."
        }]
    })
}