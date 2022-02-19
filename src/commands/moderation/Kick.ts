import { en_text }                 from '../../config.js';
import type { CommandInteraction } from 'discord.js';
import type FuriaBot               from '../../struct/discord/client.js';
import type { guild }              from '../../../index';


export default {
    permissions: "KICK_MEMBERS",
    data: en_text.command.kick.data,
    run: async (interaction: CommandInteraction, guild: guild, client: FuriaBot) => {
        
        const kickError = () => interaction.reply({
            content: `${client.Iemojis.error} I was not able to **kick** this user.`,
            ephemeral: true
        })
        
        const reason         = interaction.options.getString("reason");
        const silent         = interaction.options.getString("silent");
        const user           = interaction.options.getUser("user");
        const member         = await interaction.guild.members.fetch(user.id);

        if (!member.kickable) 
            return kickError()

        await user.send(`> ${client.Iemojis.error} You have been **Kicked** from the guild **${interaction.guild.name}** ${reason ? `\`reason:\` ${reason}` : ""}`).catch(() => {})

        try {
            await member.kick();
            
            return interaction.reply({
                content: `${client.Iemojis.success} <@${member.id}> has been **Kicked** ${reason ? `\`reason:\` ${reason}.` : ""}`,
                ephemeral: silent === "true" ? true : false
            })
        }

        catch { 
            return kickError();
        }

    }
}
