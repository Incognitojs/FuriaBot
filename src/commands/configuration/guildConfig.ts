import { SlashCommandBuilder as Command } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { guildHandler } from '../../index.js';
import type { guild } from '../../../index';

export default {
    permissions: ["ADMINISTRATOR"],
    data: new Command()
        .setName("config")
        .setDescription("Some configuration options")

        .addSubcommandGroup(option =>
            option.setName("toggle")
                .setDescription("Enable and disable certain features")
                .addSubcommand(subcommand =>
                    subcommand.setName("greetings")
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

    run: (interaction: CommandInteraction, guild: guild) => {

        if (interaction.options.getSubcommand() === 'greetings') {
            const choice: string = interaction.options.getString("toggle");
            const channel = interaction.options.getChannel("channel");
            if (channel.type !== "GUILD_TEXT") return interaction.reply("Provided channel must be a **Text** channel.")

            if (choice === "disable" && !guild.welcome_c_id)
                return interaction.reply("You would need to enable welcome / leave messages in order to disable them.")

            guildHandler.updateWelcomeMessageId(interaction.guild.id, choice === "enable" ? channel.id : false)

            const messageToSendBack: string = choice === "enable"
                ? `**Enabled** <a:check:939414542318972989> \nI will welcome and dismiss people in <#${channel.id}>. You can change the default messages with \`/config edit message\``
                : `**Disabled** <a:check:939414542318972989> \nI will stop welcoming and dismissing people. <#${guild.welcome_c_id}>`

            return interaction.reply({
                embeds: [{
                    color: choice === "enable" ? '#22c55e' : '#ef4444',
                    description: messageToSendBack

                }]
            })

        }

    }
}