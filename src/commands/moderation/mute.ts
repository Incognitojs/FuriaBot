import { en_text } from '../../config.js';
import { CommandInteraction } from 'discord.js';
import { guildHandler } from '../../index.js';
import type { guild } from '../../../index';

export default {
    permissions: "KICK_MEMBERS",
    data: en_text.command.mute.data,
    run: async (interaction: CommandInteraction, guild: guild) => {
        const user = interaction.options.getUser("user");
        const member = await interaction.guild.members.fetch(user.id);
        const mutedRole = interaction.guild.roles.cache.find(role => role.name === "muted");
        const duration = interaction.options.getString("duration");
        const reason = interaction.options.getString("reason");
        const silent = interaction.options.getString("silent");

        if (!mutedRole)
            return interaction.reply({
                content: "> a **muted** role is required in order for me to mute this user. <:error:940632365921873980>",
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        label: "Create muted role",
                        style: 1,
                        //@ts-ignore
                        custom_id: "create_mute_role"
                    }]
                }],
                ephemeral: true
            })

        if (member.roles.cache.find(role => role.name === "muted"))
            return interaction.reply({
                content: "> <:error:940632365921873980> This user is already muted.",
                ephemeral: true
            })


        const muteUser = await guildHandler.muteUser(member, mutedRole, duration, reason);

        if (!muteUser)
            return interaction.reply({
                content: "> <:error:940632365921873980> failed to mute, I might be missing permissions",
                ephemeral: true
            })

        interaction.reply({
            content: `> <:error:940632365921873980> <@${user.id}> has been **muted** ${reason ? `\`reason:\` ${reason}.` : ""} ${duration ? `\`duration:\` ${duration}` : ""}`,
            ephemeral: silent === "true" ? true : false
        })

        return;

    }
}
