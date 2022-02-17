import 'dotenv/config';
import { Options } from './config.js';
import Database from './database/pool.js';
import FuriaBot from "./client.js";
import GuildHandler from './database/guildHandler.js';

const options:Options                   = new Options;
export const client:FuriaBot            = new FuriaBot(options.discord);
export const db: Database               = new Database(options.database);
export const guildHandler: GuildHandler = new GuildHandler();

await client.login();

client.handleEvents();
client.loadCommands();

/**
 * Seeing if we should 
 * unban the user ever 5 minutes.
 */
//setInterval(() => guildHandler.handleBanTimeCheck(), 5 * 60000);
