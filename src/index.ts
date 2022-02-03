import 'dotenv/config';
import { Client } from 'discord.js';
import { Options } from './config.js';
import { Pool } from 'mysql';
import Database from './database/pool.js';
import DiscordBot from "./client.js";

const discordBot: DiscordBot = new DiscordBot(process.env.token);
const db: Database = new Database((new Options).database)

discordBot.state = "login";
db.state = "connect";

export const database: Pool = db.database;
export const client: Client = discordBot.client;