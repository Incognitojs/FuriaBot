import 'dotenv/config';
import Database from './database/pool.js';
import FuriaBot from "./struct/client.js";
import { Options } from './config.js';
import { Pool } from 'mysql';

const options:      Options             = new Options;
export const db:    Pool                = (new Database(options.database)).database;
export const client:FuriaBot            = new FuriaBot(options.discord);
// export const guildHandler               = client.guildHandler;

await client.login();




/**
 * Seeing if we should 
 * unban the user ever 5 minutes.
 */

//setInterval(() => guildHandler.handleBanTimeCheck(), 5 * 60000);
