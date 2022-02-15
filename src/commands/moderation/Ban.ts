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
        const banIsPermanent: boolean = durationString === "Permanent" ? true : false
        const userIsBanned = await guildHandler.banUser(
            user,
            duration,
            interaction.user.tag,
            reason, 
            durationString,
            interaction.guild.name,
            banIsPermanent
        )

        if (!userIsBanned) {
            return interaction.reply({
                content: "> <:error:940632365921873980> I was not able to ban this user.",
                ephemeral: true
            })
        }

        interaction.reply({
            content: `> <:error:940632365921873980> <@${user.id}> has been ${banIsPermanent ? "**Permanently**": ""} **Banned** from the guild **${interaction.guild.name}** ${reason ? `\`reason:\` ${reason}.` : ""} ${!banIsPermanent ? `\`Duration\`: ${durationString}`:""}`,
            ephemeral: silent === "true" ? true: false
        })
        
        return;
    }
}
