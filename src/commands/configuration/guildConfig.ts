import { SlashCommandBuilder as Command } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default {
    permissions: ["ADMINISTRATOR"],
    data: new Command()
        .setName("config")
        .setDescription("Some configuration options")

        .addSubcommandGroup(option =>
            option.setName("toggle")
                .setDescription("Enable and disable certain features")
                .addSubcommand(subcommand =>
                    subcommand.setName("joinmsgs")
                        .setDescription("Enable welcome and leave messages for your server.")
                        .addStringOption(option =>
                            option.setName("toggle")
                                .setDescription("enable welcome and leave messages")
                                .addChoice("enable", "enable")
                                .addChoice("disable", "disable")
                                .setRequired(true))
                        .addChannelOption(option =>
                            option.setName("channel")
                                .setDescription("Select a channel for me to welcome and dsimiss users (if you're disabling then leave blank.)"))
                )
        )

        .addSubcommandGroup(option =>
            option.setName("edit")
                .setDescription("Edit certain things.")
                .addSubcommand(subcommand =>
                    subcommand.setName("message")
                        .setDescription("Edit the join or leave message.")
                        .addStringOption(option =>
                            option.setName("edit")
                                .setDescription("Edit either the welcome message, or the farewell message.")
                                .addChoice("welcome message", "welcome")
                                .addChoice("dismiss message", "dismiss")
                                .setRequired(true)
                        )
                        .addStringOption(option =>
                            option.setName("message")
                                .setDescription("Enter in the message you want, refer to /help for more info.")
                                .setRequired(true))

                )
        )
    ,

    run: (interaction: CommandInteraction) => {

        interaction.reply({
            embeds: [{
                description: "config command ran succesfully."
            }]
        })

    }
}