import { en_text } from '../../config.js';
import type { CommandInteraction } from 'discord.js';
import type FuriaBot from '../../struct/client.js';
import type { guild } from '../../../index';


export default {
    permissions: "KICK_MEMBERS",
    data: en_text.command.kick.data,
    run: async (interaction: CommandInteraction, guild: guild, client: FuriaBot) => {
        const reason: string = interaction.options.getString("reason");
        const silent = interaction.options.getString("silent");
        const mem = interaction.options.getUser("user");
        const user = await interaction.guild.members.fetch(mem.id);

        const userIsKicked = await client.guildHandler.kickUser(
            reason,
            guild.guildName,
            interaction.guild.iconURL(),
            user,
        );

        if (!userIsKicked)
            return interaction.reply({
                content: "> I was not able kick this user. <:error:940632365921873980>",
                ephemeral: true
            })

        interaction.reply({
            content: `> <:error:940632365921873980> <@${user.id}> has been **Kicked** ${reason ? `\`reason:\` ${reason}.` : ""}`,
            ephemeral: silent === "true" ? true : false
        })

        return;

    }
}
