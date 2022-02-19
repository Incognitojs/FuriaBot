import chalk from "chalk";

export default class Logger {

    discordReady = (user: string) => console.info(chalk.bgBlack(chalk.green("DISCORD BOT CONNECTED. USER: " + user)))

    databaseConnected = (user: string, host: string) => console.info(
        chalk.green(`Database connection established.`,
            chalk.blue(`[USER]:`),
            chalk.cyan(`${user}`),
            chalk.blue(`[HOST]:`),
            chalk.cyan(`${host}`))
    )

    liftSentenceError = (guildId: string, userId: string, type: string) => console.error(
        chalk.red(`Error while trying to to lift sentence for userID: ${userId} | guildId: ${guildId}`)
    )

}
