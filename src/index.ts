import 'dotenv/config';
import { Options } from './config.js';
import Database from './database/pool.js';
import DiscordBot from "./client.js";
import GuildHandler from './database/guildHandler.js';

const discordBot: DiscordBot = new DiscordBot(process.env.token);
const db: Database = new Database((new Options).database)
const guildHandler: GuildHandler = new GuildHandler(db.database);

export {
    guildHandler,
    discordBot,
    db
}


/**
 * Seeing if we should 
 * unban the user ever 5 minutes.
 */
 setInterval(() => guildHandler.handleBanTimeCheck(), 5 * 60000);