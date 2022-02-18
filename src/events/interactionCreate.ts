import { Interaction, Permissions, GuildMember } from 'discord.js';
import type FuriaBot from '../struct/client.js'
import type { guild } from '../../index';

export default {
    name: "interactionCreate",
    once: false,
    execute: async (interaction: Interaction, client: FuriaBot) => {
        /**
         * Getting the guild ID of where
         * the command was ran.
         */
        const guildID: string = interaction.guild.id;
        /**
         * Current guild.
         */
        const guild: guild = client.guildHandler.guildContents.filter(item => item.guildID === guildID)[0];
        /**
         * The member who ran the command.
         */
        const member = await interaction.guild.members.fetch(interaction.user.id);

        if (interaction.isButton()) {
            switch (interaction.customId) {
                case "create_mute_role":
                    const mutedRole = interaction.guild.roles.cache.find(role => role.name === "muted");
                    if (mutedRole) return interaction.reply({
                        content: "It appears there is already a **muted** role within this guild.",
                        ephemeral: true
                    })

                    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) 
                        return interaction.reply({
                            content: `<:error:940632365921873980> I am lacking the required permission(s): **MANAGE_ROLES**}`,
                            ephemeral: true
                        })
                    
                    const newMutedRole = await interaction.guild.roles.create({
                        name: "muted",
                        color: "#18181b",
                        permissions: [],
                    })
                    
                
                    newMutedRole.setPermissions([
                        Permissions.FLAGS.VIEW_CHANNEL
                    ])

                    return interaction.reply({
                        content: "button clicked",
                        ephemeral: true,
                    })

            }
        }

        /**
         * If the interaction is not a 
         * slash command then we just return
         */
        if (!interaction.isCommand()) return;
        let { permissions, run } = client.commandCollection.get(interaction.commandName).default;
        /**
         * Checking if the user has the correct permissions.
         */
        if (permissions) {
            if (typeof permissions === "string") permissions = [permissions];
            for (const perm of permissions) {

                /**
                 * Checking bots permissions.
                 */
                if (!member.guild.me.permissions.has(perm))
                    return interaction.reply({
                        content: `**I** am lacking the required permission: **${perm}** <:error:940632365921873980>`,
                        ephemeral: true,
                    })

                /**
                 * Checking users permissions.
                 */
                if (!member.permissions.has(perm))
                    return interaction.reply({
                        content: `You are lacking the permission: **${perm}** <:error:940632365921873980>`,
                        ephemeral: true
                    });
            }
        }

        if (guild?.cmd_c_id && interaction.channel.id !== guild?.cmd_c_id)
            return interaction.reply({
                content: `Please use my commands in the correct channel. <#${guild.cmd_c_id}> <:error:940632365921873980>`,
                ephemeral: true
            });


        /**
         * Running the command;
         */
        return run(interaction, guild, client);

    }
}