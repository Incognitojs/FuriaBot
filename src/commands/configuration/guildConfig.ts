import { CommandInteraction, Channel } from 'discord.js';
import { guildHandler } from '../../index.js';
import { en_text } from '../../config.js';
import type { guild } from '../../../index';

export default {
    permissions: ["ADMINISTRATOR"],
    data: en_text.command.config.data,
    run: (interaction: CommandInteraction, guild: guild) => {

        let choice: string;
        let channel: Channel;
        let message: string;

        switch (interaction.options.getSubcommandGroup()) {
            
            case 'greetings':

                switch (interaction.options.getSubcommand()) {
            
                    case "toggle":
                        choice = interaction?.options?.getString("option")
                        channel = interaction?.options?.getChannel("channel") as Channel;

                        if (channel.type !== "GUILD_TEXT")
                            return interaction.reply({
                                content: "Provided channel must be a **Text** channel. <:error:940632365921873980>",
                                ephemeral: true
                            })

                        if (choice === "disable" && !guild.welcome_c_id)
                            return interaction.reply({
                                content: "This configuration option is not currently enabled. <:error:940632365921873980>",
                                ephemeral: true
                            })

                        guildHandler.updateWelcomeMessageId(interaction.guild.id, choice === "enable" ? channel.id : false)

                        return interaction.reply({
                            embeds: [{
                                color: choice === "enable" ? '#22c55e' : '#ef4444',
                                description: choice === "enable"
                                    ? `**Enabled** <a:success:940632460193067059> \nI will welcome and dismiss people in <#${channel.id}>. You can change the default messages with \`/config greetings edit\``
                                    : `**Disabled** <a:success:940632460193067059> \nI will no longer use <#${guild.welcome_c_id}> to welcome and dismiss people.`
                            }],
                            ephemeral: true
                        })


                    case "edit":
                        choice = interaction.options.getString('option');
                        message = interaction.options.getString("message");

                        if (!guild.welcome_c_id)
                            return interaction.reply({
                                content: "You must enable the welcome / leave announcements feature before using this command. <:error:940632365921873980>",
                                ephemeral: true
                            })

                        guildHandler.updateWelcomeMessage(interaction.guild.id, message, choice);

                        return interaction.reply({
                            embeds: [{
                                color: '#22c553',
                                description: `**New message set <a:success:940632460193067059>**
                                            Here's an example of how users will be *${choice === 'welcome' ? "welcomed" : "dismissed"}* with your new message:\n 
                                            > ${message.search(/<@>/g) ? message.replace(/<@>/g, `<@${interaction.user.id}>`) : message}`
                            }],
                            ephemeral: true
                        })

                }


        }

    }
}