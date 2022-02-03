import { SlashCommandBuilder as Command } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default {
    channelStrict: false,
    data: new Command()
        .setName("mute")
        .setDescription("Mute a user."),

    run: (interaction: CommandInteraction) => interaction.reply({
        embeds: [{
            description: "mute command ran succesfully."
        }]
    })
}