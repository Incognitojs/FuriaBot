import { Client } from 'discord.js';

export interface Client extends Client {
    commands: any[];
    commandCollection: Collection<any>;
}