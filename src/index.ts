import 'dotenv/config';
import { Client } from 'discord.js';
import { Options } from './config.js';
import Database from './database/pool.js';
import DiscordBot from "./client.js";
import GuildHandler from './database/guildHandler.js';

const discordBot: DiscordBot = new DiscordBot(process.env.token);
const db: Database = new Database((new Options).database)
const guildHandler: GuildHandler = new GuildHandler();
const client: Client = discordBot.client;

discordBot.state = "login";
db.state = "connect";

export {
    guildHandler,
    client,
    db
}