import { en_text } from '../../config.js';
import { CommandInteraction } from 'discord.js';
import { guildHandler } from '../../index.js';
import type { guild } from '../../../index';

export default {
    permissions: "KICK_MEMBERS",
    data: en_text.command.mute.data,
    run: async (interaction: CommandInteraction, guild: guild) => {
        const duration = interaction.options.getString("duration");
        const reason   = interaction.options.getString("reason");
        const silent   = interaction.options.getString("silent");

        const member    = await interaction.guild.members.fetch(interaction.options.getUser("user"))
        const mutedRole = interaction.guild.roles.cache.find(role => role.name === "muted");

        
        // if (!mutedRole)
        //     return interaction.reply({
        //         content: "> a **muted** role is required in order for me to mute this user. <:error:940632365921873980>",
        //         components: [{
        //             type: 1,
        //             components: [{
        //                 type: 2,
        //                 label: "Create muted role",
        //                 style: 1,
        //                 //@ts-ignore
        //                 custom_id: "create_mute_role"
        //             }]
        //         }],
        //         ephemeral: true
        //     })


        try {
            await guildHandler.muteUser({
                member: member,
                mutedRole: mutedRole,
                reason: reason,
                duration: duration,
                
            })
            interaction.reply({
                content: `> <:error:940632365921873980> <@${member.id}> has been **muted** ${reason ? `\`reason:\` ${reason}.` : ""} ${duration ? `\`duration:\` ${duration}` : ""}`,
                ephemeral: silent === "true" ? true : false
            })

        }
        catch (error) {
            switch (error?.message) {
                case "convert_time":
                    return interaction.reply({
                        content: "The duration given was not in the correct format. Do /help for more info",
                        ephemeral: true
                    })

                case "Missing Access":
                    return interaction.reply({
                        content: "I do not have permission to mute.",
                        ephemeral: true
                    })

                case "HASROLE":
                    return interaction.reply({
                        content: "This user is already muted.",
                        ephemeral: true
                    })
            }
        }
        return;
    }
}
