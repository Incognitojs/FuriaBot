import { ButtonInteraction, Permissions } from 'discord.js';
import type FuriaBot                      from '../../struct/discord/client.js';

export default async function buttonHandler(interaction: ButtonInteraction, client: FuriaBot) {
    
    switch (interaction.customId) {
        case "create_mute_role":
            const mutedRole = interaction.guild.roles.cache.find(role => role.name === "muted");

            if (mutedRole)
                return client.ErrorHandler.roleExists(interaction, mutedRole.name);

            if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
                return client.ErrorHandler.noBotPermission(interaction, "MANAGE_ROLES")

            try {
                
                const MutedRole = await interaction.guild.roles.create({ name: "muted", color: "#18181b", permissions: [] })

                MutedRole.setPermissions([ Permissions.FLAGS.VIEW_CHANNEL ]);

                return interaction.reply({
                    content: `> ${client.Iemojis.success} Successfully created the **muted** role.`,
                    ephemeral: true
                })
            }

            catch { return client.ErrorHandler.roleCreate(interaction, "muted") };


    }


}