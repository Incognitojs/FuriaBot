import { Client } from 'discord.js';

export interface Client extends Client {
    commands: any[];
    commandCollection: Collection<any>;
}


export type guild = {
    guildID: string,
    guildName: string,
    ownerName: string,
    cmd_c_id?: null | string,
    welcome_c_id?: null | string,
    welcome_msg?: null | string,
    created_at?: null | string
}