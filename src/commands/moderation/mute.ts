import { en_text }                 from '../../config.js';
import type { CommandInteraction } from 'discord.js';
import type { guild }              from '../../../index';
import type FuriaBot               from '../../struct/client.js';
import { db }                      from '../../index.js';
import { getUnmuteTime }           from '../../util/time/convertTime.js';

export default {
    permissions: "MANAGE_ROLES",
    data: en_text.command.mute.data,
    run: async (interaction: CommandInteraction, guild: guild, client: FuriaBot) => {

        const muteError = () => interaction.reply({
            content: `> ${client.Iemojis.error} I was not able to **mute** this user.`,
            ephemeral: true
        })

        const duration = interaction.options.getString("duration");
        const reason   = interaction.options.getString("reason");
        const silent   = interaction.options.getString("silent");

        const member    = await interaction.guild.members.fetch(interaction.options.getUser("user"))
        const mutedRole = interaction.guild.roles.cache.find(role => role.name === "muted");

        if (member.roles.cache.find(role => role.name === mutedRole.name))
            return interaction.reply({ content: `> ${client.Iemojis.error} This user is already muted.`, ephemeral: true })

        if (!mutedRole)
            return interaction.reply({
                content: `> ${client.Iemojis.error} a **muted** role is required for me to mute someone.`,
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

            const muteTime = await getUnmuteTime(duration);
        
            await member.roles.add(mutedRole);
            await member.send(`> ${client.Iemojis.error} You have been **muted** in the guild **${member.guild.name}** ${reason ? `\`reason:\` ${reason}.` : ""} ${duration ? `\`duration:\` ${duration}` : ""}`)
            
            db.query(
                "USE discord; INSERT IGNORE into muted (guildID, mutedID, reason, duration) VALUES(?,?,?,?)",
                [member.guild.id, member.id, reason, Math.floor(Date.now() / 1000 + muteTime)]
            )     

            return await interaction.reply({
                content: `> ${client.Iemojis.success} <@${member.id}> has been **muted** ${reason ? `\`reason:\` ${reason}.` : ""} ${duration ? `\`duration:\` ${duration}` : ""}`,
                ephemeral: silent === "true" ? true : false
            })

        }

        catch (err) { 
            if (err.message === "convert_time") 
                return interaction.reply({
                    content: `> ${client.Iemojis.error} The duration given was not in the correct format. Refer to \`/help\` for more info.`,
                    ephemeral: true
                }) 
            return muteError()
         };

    }
}
