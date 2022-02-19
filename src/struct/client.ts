import { 
    rootGuildID,
    loadCommandsBoolean, 
    Options, 
    config 
}                              from '../config.js';
import { Collection, Client }  from 'discord.js';
import { readdir }             from 'fs/promises';
import { lstatSync }           from 'fs';
import { REST }                from '@discordjs/rest';
import { Routes }              from 'discord-api-types/v9';
import { logger }              from '../index.js';
import _dirname                from '../util/dirname.js';
import GuildHandler            from './guildHandler.js';
import path                    from 'path';

class Iemojis {
    error   = "<:error:940632365921873980>";
    success = "<a:success:940632460193067059>";
}

export default class FuriaBot extends Client {

    public disabledCommands:  string[]
    public commandCollection: any
    public commands:          any[]
    public guildHandler:      GuildHandler
    public Iemojis:           Iemojis

    constructor(options: Options['discord']) {
        super(options)

        this.token             = process.env.token
        this.disabledCommands  = config.disabledCommands || []
        this.guildHandler      = new GuildHandler(this)
        this.Iemojis           = new Iemojis
        this.commandCollection = new Collection()
        this.commands          = []

        this.on("ready", async () => {
            this.handleEvents();
            this.loadCommands();
            logger.discordReady(this.user.tag)
            await this.guildHandler.getAllGuildContent()
            this.guildHandler.handleSentenceTime()
        })
    }

    public async handleEvents() {
        for (const file of (await readdir('./dist/events')).filter(file => file.endsWith(".js"))) {
            const event = (await import(`../events/${file}`)).default;
            event.once
                ? this.once(event.name, (...args) => event.execute(...args, this))
                : this.on(event.name, (...args) => event.execute(...args, this))
        }
    }

    public async loadCommands() {
        for (const element of await readdir('./dist/commands')) {
            element.endsWith("js") && this._loadCmd(element, "not dir");
            if (lstatSync(path.join(_dirname, '../commands', element)).isDirectory()) {
                for (const file of (await readdir(`./dist/commands/${element}`)).filter(file => file.endsWith(".js")))
                    this._loadCmd(file, element)
            }
        }
    }

    private async _loadCmd(file: string, dir?: string) {
        const command = dir ? await import(`../commands/${dir}/${file}`) : await import(`../commands/${file}`)
        this.commands.push(command.default.data);
        this.commandCollection.set(command.default.data.name, command);
        const rest: REST = new REST({ version: '9' }).setToken(this.token);
        const botID = this.user.id
        return async () => {
            await rest.put(Routes.applicationGuildCommands(botID, rootGuildID), { body: this.commands }).catch(console.error);
            loadCommandsBoolean && await rest.put(Routes.applicationCommands(botID), { body: [] }).catch(console.error);
        }
    }



}