import { PoolConfig } from "mysql";
import { readFile } from 'fs/promises';

export const rootGuildID: string = process.env.rootGuild;
export const loadCommandsBoolean: boolean = process.env.loadCommandsBool === "true" ? true : false;
export const ownerID: string = process.env.ownerID

const unParsed: any = await readFile('./lang/en/commands/commands.json');
export const en_text = JSON.parse(unParsed);

class DatabaseOptions implements PoolConfig {
    host = process.env.host;
    user = process.env.user;
    password = process.env.pass;
    multipleStatements = true
}

export class Options {
    database: DatabaseOptions = new DatabaseOptions();
}

