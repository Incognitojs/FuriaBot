import { CommandInteraction } from 'discord.js';
import { en_text } from '../../config.js';
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
        const currentDate: number = Date.now();

        let duration: number;
        let durationString: string;

        switch (durationChoice) {
            case '1d':
                duration = currentDate + 86400
                durationString = "1 day"
                break;
            case '2d':
                duration = currentDate + 172800
                durationString = "2 days"
                break;
            case '3d':
                duration = currentDate + 259200

                durationString = "3 days"
                break;
            case '4d':
                duration = currentDate + 345600
                durationString = "4 days"
                break;
            case '5d':
                duration = currentDate + 432000
                durationString = "5 days"
                break;
            case '6d':
                duration = currentDate + 518400
                durationString = "6 days"
                break;
            case '7d':
                duration = currentDate + 604800
                durationString = "7 days"
                break;
            case '2w':
                duration = currentDate + 1209600
                durationString = "2 weeks"
                break;
            case 'perm':
                duration = 0
                durationString = "Permanent"
                break;
        }

        await mem.send({
            embeds: [{
                color: '#ef4444',
                author: {
                    name: `${guild.guildName}`,
                    icon_url: interaction.guild.iconURL()
                },
                description: `You have been **banned ${durationString === "Permanent" ? "Permanently" : ""}**${reason ? `, reason: \`${reason}\`` : ""}${durationString !== "Permanent" ? `, Duration: \`${durationString}\`` : ""}`,
                timestamp: new Date(),
                footer: {
                    text: `banned by ${interaction.user.tag}`
                }
            }]
        }).catch(() => null);

        try { await user.ban() }
        catch {
            return interaction.reply({
                content: "I was not able ban this user. <:error:940632365921873980>",
                ephemeral: true
            })
        }

        return interaction.reply({
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

    }
}
