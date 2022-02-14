import { CommandInteraction } from 'discord.js';
import { en_text } from '../../config.js';
import { guildHandler } from '../../index.js'
import { durationChoiceConvert } from '../../util/convertTime.js';
import type { guild } from '../../../index';

export default {
    permissions: "BAN_MEMBERS",
    data: en_text.command.ban.data,
    run: async (interaction: CommandInteraction, guild: guild) => {

        const reason: string = interaction.options.getString("reason");
        const silent = interaction.options.getString("silent");
        const durationChoice = interaction.options.getString("duration");
        const mem = interaction.options.getUser("user");
        const user = await interaction.guild.members.fetch(mem.id);

        const { duration, durationString } = durationChoiceConvert(durationChoice);
        const userIsBanned = await guildHandler.banUser(
            user,
            duration,
            interaction.user.tag,
            reason, durationString,
            interaction.guild.iconURL(),
            interaction.guild.name,
        )

        if (!userIsBanned) {
            return interaction.reply({
                content: "I was not able to ban this user. <:error:940632365921873980>",
                ephemeral: true
            })
        }

        interaction.reply({
            embeds: [{
                color: '#ef4444',
                author: {
                    name: `${guild.guildName}`,
                    icon_url: interaction.guild.iconURL()
                },
                description: `<@${user.id}> has been **banned ${durationString === "Permanent" ? "Permanently" : ""}**${reason ? `, reason: \`${reason}\`` : ""}${durationString !== "Permanent" ? `, Duration: \`${durationString}\`` : ""}`,
                timestamp: new Date(),
                footer: {
                    text: `banned by ${interaction.user.tag}`
                }
            }], ephemeral: silent === "true" ? true : false
        })

        return;

    }
}
