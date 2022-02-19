import { CommandInteraction }    from 'discord.js';
import { en_text }               from '../../config.js';
import { durationChoiceConvert } from '../../util/time/convertTime.js';
import type { guild }            from '../../../index';
import type FuriaBot             from '../../struct/client.js';
import { db }                    from '../../index.js';

export default {
    permissions: "BAN_MEMBERS",
    data: en_text.command.ban.data,
    run: async (interaction: CommandInteraction, guild: guild, client: FuriaBot) => {

        const banError = () => interaction.reply({
            content: `> ${client.Iemojis.error} I was not able to **ban** this user.`,
            ephemeral: true
        }) 

        const reason            = interaction.options.getString("reason");
        const silent            = interaction.options.getString("silent");
        const durationChoice    = interaction.options.getString("duration");
        const user              = interaction.options.getUser("user");
        const member            = await interaction.guild.members.fetch(user.id);

        const { duration, durationString } = durationChoiceConvert(durationChoice);
        
        const banIsPermanent: boolean = durationString === "Permanent"
                                                                ? true 
                                                                : false

        await user.send(`> ${client.Iemojis.error} You have been ${banIsPermanent ? "**Permanently**" : ""} **Banned** from the guild **${member.guild.name}** ${reason ? `\`reason:\` ${reason}.` : ""} ${!banIsPermanent ? `\`Duration\`: ${durationString}` : ""}`).catch(() => {});

        try { 

            if (!member.bannable) return banError();

            //await member.ban();

            db.query(
                "USE discord; INSERT IGNORE INTO banned (guildID,guildName,bannedID,userBanned,bannedBy,reason,duration) VALUES(?,?,?,?,?,?,?)",
                [interaction.guild.id, interaction.guild.name, member.user.id, member.user.tag, interaction.user.tag, reason, duration],
                err => {
                    if (err) throw new Error(err.message);
                }
            )

            return await interaction.reply({
                content: `> ${client.Iemojis.success} <@${user.id}> has been ${banIsPermanent ? "**Permanently**": ""} **Banned** from the guild **${interaction.guild.name}** ${reason ? `\`reason:\` ${reason}.` : ""} ${!banIsPermanent ? `\`Duration\`: ${durationString}`:""}`,
                ephemeral: silent === "true" ? true: false
            })


        }

        catch { return banError() }
        
    }
}
