import type { CommandInteraction, GuildMember } from 'discord.js';
import type FuriaBot                            from '../../struct/discord/client';
import type { guild }                           from '../../../index';

export default async function commandHandler(interaction: CommandInteraction, client: FuriaBot, member: GuildMember) {

    const thisGuild: guild   = client.guildHandler.guildContents.filter(item => item.guildID === interaction.guild.id)[0];
    let { permissions, run } = client.commandCollection.get(interaction.commandName).default;

    if (permissions) {
        if (typeof permissions === "string") permissions = [permissions];

        for (const perm of permissions) {
            if (!member.guild.me.permissions.has(perm))
                return client.ErrorHandler.noBotPermission(interaction, perm);

            if (!member.permissions.has(perm))
                return client.ErrorHandler.noUserPermission(interaction, perm);
        }
    }

    return run(interaction, thisGuild, client);

}