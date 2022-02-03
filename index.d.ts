import { Client } from 'discord.js';

export interface Client extends Client {
    commands: any[];
    commandCollection: Collection<any>;
}

// declare module "discord.js" {
//     export interface Client {
//         commands: any[],
//         commandsCollection: Collection<unknown, any>
//     }
// }