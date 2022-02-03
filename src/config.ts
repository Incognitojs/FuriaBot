import { PoolConfig } from "mysql";

export const rootGuildID: string = process.env.rootGuild;
export const loadCommandsBoolean: boolean = process.env.loadCommandsBool === "true" ? true : false;
export const ownerID: string = process.env.ownerID


class DatabaseOptions implements PoolConfig {
    host = process.env.host;
    user = process.env.user;
    password = process.env.pass;
}

export class Options {
    database: DatabaseOptions = new DatabaseOptions();
}

