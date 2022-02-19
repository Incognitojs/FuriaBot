import chalk from "chalk";
import type { Guild } from 'discord.js';

export default class Logger {
    discordReady      = (user: string) => console.info(chalk.bgBlack(chalk.green("DISCORD BOT CONNECTED. USER: " + user)))
    databaseConnected = (user: string, host: string) => console.info(chalk.green(`Database connection established.`,chalk.blue(`[USER]:`),chalk.cyan(`${user}`),chalk.blue(`[HOST]:`),chalk.cyan(`${host}`)))
    GuildJoined       = (guild: Guild) => console.info(chalk.green("Joined the guild:"), chalk.cyan(guild.name), chalk.blue(`Time: ${Date.now()}`))
    newGuildJoined    = (guild: Guild) => console.info(chalk.green("Joined the guild:"),chalk.cyan(guild.name),chalk.green("for the first time!"),chalk.blue(`Time: ${Date.now()}`))
}