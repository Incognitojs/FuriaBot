import { Guild, Client, User } from 'discord.js';
import { guildHandler } from '../index.js';
import chalk from 'chalk';

export default {
    name: "guildCreate",
    once: false,
    execute: async (guild: Guild, client: Client) => {
        const user = await client.users.fetch(guild.ownerId).catch(console.error) as User;
        const ownerName: string = `${user.username}${user.discriminator}`;
        /**
         * Checking if the guild already has a spot in the database or not.
         */
        const guildExists = await guildHandler.guildExistsInDatabase(guild.id);
        /**
         * If guild does not exists, 
         * then we make them a new spot in the database.
         */
        if (!guildExists) {
            guildHandler.insertGuild(guild.id, guild.name, ownerName)
            console.log(
                chalk.green("Joined the guild:"),
                chalk.cyan(guild.name),
                chalk.green("for the first time!"),
                chalk.blue(`Time: ${Date.now()}`)
            )
            /**
             * Sending message to the guild owner.
             */
            await user.send({
                embeds: [{
                    color: '#ec4899',
                    description: "Hey, **thank you** for inviting me to your server! To get started use the `/help` or `/setup` command withing your server. Still stuck? Join the support discord for quick help. 😺"
                }],

                components: [{
                    type: 1,
                    components: [{
                        type: 2, style: 5,
                        label: "Support Server",
                        url: "https://discord.gg/U6mn3j2RaS"
                    }]
                }]

            }).catch(console.error)
            return;
        }
        console.log(
            chalk.green("Joined the guild:"),
            chalk.cyan(guild.name),
            chalk.blue(`Time: ${Date.now()}`)
        )
        return;
    }
}