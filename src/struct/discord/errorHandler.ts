import type { ButtonInteraction, CommandInteraction } from 'discord.js';
import type FuriaBot from '../discord/client.js';
import chalk from "chalk";

type Iinteraction = CommandInteraction | ButtonInteraction;

export default class ErrorHandler {
    constructor(private client: FuriaBot) { };

    roleExists = (interaction: Iinteraction, role: string) => interaction.reply({
        content: `> ${this.client.Iemojis.error} The role **${role}** already exists within this guild.`,
        ephemeral: true
    })

    roleCreate = (interaction: Iinteraction, role: string) => interaction.reply({
        content: `> ${this.client.Iemojis.error} An error occurred while creating the role **${role}**`,
        ephemeral: true
    })

    noUserPermission = (interaction: Iinteraction, perms: string | string[]) => {
        if (typeof perms === "string") perms = [perms];
        return interaction.reply({
            content: `> ${this.client.Iemojis.error} You are lacking the required permissions. **${perms.map(perm => `${perm} ${perms.length > 1 ? ", " : ""}`)}**`,
            ephemeral: true
        })
    }

    noBotPermission = (interaction: Iinteraction, perms: string | string[]) => {
        if (typeof perms === "string") perms = [perms];
        return interaction.reply({
            content: `> ${this.client.Iemojis.error} I am lacking the required permissions. **${perms.map(perm => `${perm} ${perms.length > 1 ? ", " : ""}`)}**`,
            ephemeral: true
        })
    }

    liftSentence = (guildId: string, userId: string) =>
        console.error(chalk.red(`Error while trying to to lift sentence for userID: ${userId} | guildId: ${guildId}`))

    durationFormat = (interaction: Iinteraction) => interaction.reply({
        content: `> ${this.client.Iemojis.error} The duration given was not in the correct format. Refer to \`/help\` for more info.`,
        ephemeral: true
    })

    noMutedRole = (interaction: Iinteraction) => interaction.reply({
        content: `> ${this.client.Iemojis.error} a **muted** role is required for me to mute someone.`,
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

    alreadyMuted = (interaction: Iinteraction) => interaction.reply({
        content: `> ${this.client.Iemojis.error} This user is already **muted**`,
        ephemeral: true
    })

    kick = (interaction: Iinteraction) => interaction.reply({
        content: `> ${this.client.Iemojis.error} I was not able to **kick** this user`,
        ephemeral: true
    })

    ban = (interaction: Iinteraction) => interaction.reply({
        content: `> ${this.client.Iemojis.error} I was not able to **ban** this user`,
        ephemeral: true
    })

    mute = (interaction: Iinteraction) => interaction.reply({
        content: `> ${this.client.Iemojis.error} I was not able to **mute** this user.`,
        ephemeral: true
    })

}