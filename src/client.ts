import { Intents, Collection, Client as _client } from 'discord.js';
import { readdir } from 'fs/promises';
import { lstatSync } from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { rootGuildID, loadCommandsBoolean } from './config.js';
import { guildHandler } from './index.js';
import _dirname from './util/dirname.js';
import path from 'path';
import chalk from 'chalk';
import type { Client } from '../index';

export default class DiscordBot {
    private token: string | undefined;
    private _state: "login" | undefined;
    public client: Client;

    constructor(token: string) { 
        this.token = token
        this.state = "login";
    }

    set state(state: typeof DiscordBot.prototype._state) {
        switch (state) {
            case 'login':
                this.client = new _client({
                    partials: ["CHANNEL"],
                    intents: [
                        Intents.FLAGS.GUILDS,
                        Intents.FLAGS.GUILD_MEMBERS,
                        Intents.FLAGS.GUILD_MESSAGES,
                        Intents.FLAGS.DIRECT_MESSAGES,
                        Intents.FLAGS.DIRECT_MESSAGE_TYPING
                    ]
                }) as Client;
                this.client.login(this.token);
                this.client.once("ready", () => {
                    console.info(
                            chalk.green(`Discord connection established.`,
                            chalk.blue(`[USER]:`),
                            chalk.cyan(`${this.client.user.tag}`))
                    )
                    guildHandler.getAllGuildContent();
                    this.handleEvents();

                })
        }
    }


    async handleEvents() {
        const eventFiles: string[] = (await readdir('./dist/events')).filter(f => f.endsWith(".js"));
        for (const file of eventFiles) {
            const eventModule = await import(`./events/${file}`);
            const event = eventModule?.default;
            event.once
                ? this.client.once(event.name, (...args: any) => event.execute(...args, this.client))
                : this.client.on(event.name, (...args: any) => event.execute(...args, this.client))
        }
        this.loadCommands();
    }

    async loadCommands() {
        this.client.commandCollection = new Collection();
        this.client.commands = [];

        const commandDirectory: string[] = await readdir('./dist/commands')

        const loadCmd = async (file: string, dir?: string) =>
            new Promise(async resolve => {
                const command = dir
                    ? await import(`./commands/${dir}/${file}`).catch(console.error)
                    : await import(`./commands/${file}`).catch(console.error);
                this.client.commandCollection.set(command.default.data.name, command);
                this.client.commands.push(command.default.data);
                console.info(chalk.green("Loaded command: "), chalk.blue(`${command.default.data.name}`))
                resolve(true);
            })

        for (const item of commandDirectory) {
            const stat = lstatSync(path.join(_dirname, '../commands', item));
            if (stat.isDirectory()) {
                const commandFiles = (await readdir(`./dist/commands/${item}`)).filter(f => f.endsWith('.js'));
                for (const file of commandFiles) {
                    await loadCmd(file, item);
                }
            }
            item.endsWith('.js') && await loadCmd(item);
        }

        const rest: REST = new REST({ version: '9' }).setToken(this.token)
        const botID: string = this.client.user.id;

        await rest.put(Routes.applicationGuildCommands(botID, rootGuildID), { body: this.client.commands }).catch(console.error);
        loadCommandsBoolean && await rest.put(Routes.applicationCommands(botID), { body: [] }).catch(console.error);

        return
    }
}