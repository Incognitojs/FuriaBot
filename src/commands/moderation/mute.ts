import { en_text } from '../../config.js';
import { CommandInteraction } from 'discord.js';
//import { guildHandler } from '../../index.js';
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

        if (member.roles.cache.find(role => role.name === mutedRole.name))
            return interaction.reply({ content: "This user is already muted.", ephemeral: true })

        if (!mutedRole)
            return interaction.reply({
                content: "a **muted** role is required for me to mute someone.",
                ephemeral: true,
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        label: "Create muted role",
                        style: 1,
                        customId: "create_mute_role"
                    }]
                }]
            });

        try {
            await member.roles.add(mutedRole);
            await member.send(`> <:error:940632365921873980> You have been **muted** in the guild **${member.guild.name}** ${reason ? `\`reason:\` ${reason}.` : ""} ${duration ? `\`duration:\` ${duration}` : ""}`)
            interaction.reply({
                content: `> <:error:940632365921873980> <@${member.id}> has been **muted** ${reason ? `\`reason:\` ${reason}.` : ""} ${duration ? `\`duration:\` ${duration}` : ""}`,
                ephemeral: silent === "true" ? true : false
            })
        }

        catch (error) {
            return console.log(error)
        }




        return;
    }
}
