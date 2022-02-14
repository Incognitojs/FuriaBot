import { CommandInteraction } from 'discord.js';
import { en_text } from '../../config.js';
import { guildHandler } from '../../index.js';
import type { guild } from '../../../index';


export default {
    permissions: "KICK_MEMBERS",
    data: en_text.command.kick.data,
    run: async (interaction: CommandInteraction, guild: guild) => {
        const reason: string = interaction.options.getString("reason");
        const silent = interaction.options.getString("silent");
        const mem = interaction.options.getUser("user");
        const user = await interaction.guild.members.fetch(mem.id);

        const userIsKicked = await guildHandler.kickUser(
            reason,
            guild.guildName,
            interaction.guild.iconURL(),
            user,
            interaction.user.tag
        );

        if (!userIsKicked)
            return interaction.reply({
                content: "I was not able kick this user. <:error:940632365921873980>",
                ephemeral: true
            })

        interaction.reply({
            embeds: [{
                color: '#f97316',
                author: {
                    name: `${guild.guildName}`,
                    icon_url: interaction.guild.iconURL()
                },
                description: `<@${user.id}> has been **removed**${reason ? `, reason: \`${reason}\`` : ""}`,
                timestamp: new Date(),
                footer: {
                    text: `Removed by ${interaction.user.tag}`
                }
            }], ephemeral: silent === "true" ? true : false
        })

        return;

    }
}
