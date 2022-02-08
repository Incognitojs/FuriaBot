import { SlashCommandBuilder as Command } from '@discordjs/builders';
import { CommandInteraction, Channel } from 'discord.js';
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

        let choice: string;
        let channel: Channel;
        let message: string;

        switch (interaction.options.getSubcommand()) {

            case 'greetings':
                choice = interaction?.options?.getString("toggle")
                channel = interaction?.options?.getChannel("channel") as Channel
                if (channel.type !== "GUILD_TEXT") return interaction.reply("Provided channel must be a **Text** channel.")
                if (choice === "disable" && !guild.welcome_c_id) return interaction.reply({ content: "This configuration option is not currently enabled.", ephemeral: true })

                guildHandler.updateWelcomeMessageId(interaction.guild.id, choice === "enable" ? channel.id : false)

                return interaction.reply({
                    embeds: [{
                        color: choice === "enable" ? '#22c55e' : '#ef4444',
                        description: choice === "enable"
                            ? `**Enabled** <a:check:939414542318972989> \nI will welcome and dismiss people in <#${channel.id}>. You can change the default messages with \`/config edit message\``
                            : `**Disabled** <a:check:939414542318972989> \nI will no longer use <#${guild.welcome_c_id}> to welcome and dismiss people.`
                    }],
                    ephemeral: true
                })

            case 'message':
                choice = interaction.options.getString('edit');
                message = interaction.options.getString("message");

                guildHandler.updateWelcomeMessage(interaction.guild.id, message, choice);

                return interaction.reply({
                    embeds: [{
                        color: '#22c553',
                        description: `**New message set <a:check:939414542318972989>**
                                    Here's an example of how users will be *${choice === 'welcome' ? "welcomed" : "dismissed"}* with your new message:\n 
                                    > ${message.search(/<@>/g) ? message.replace(/<@>/g, `<@${interaction.user.id}>`) : message}`
                    }],
                    ephemeral: true
                })

        }

    }
}