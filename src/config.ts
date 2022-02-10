import { PoolConfig } from "mysql";
import { readFile } from 'fs/promises';

export const rootGuildID: string = process.env.rootGuild;
export const loadCommandsBoolean: boolean = process.env.loadCommandsBool === "true" ? true : false;
export const ownerID: string = process.env.ownerID

const _en_text: any = await readFile('./lang/en/commands/commands.json');
export const en_text = JSON.parse(_en_text);

const _colors: any = await readFile('./colors.json');
export const colors = JSON.parse(_colors);

class DatabaseOptions implements PoolConfig {
    host = process.env.host;
    user = process.env.user;
    password = process.env.pass;
    multipleStatements = true
}

export class Options {
    database: DatabaseOptions = new DatabaseOptions();
}

