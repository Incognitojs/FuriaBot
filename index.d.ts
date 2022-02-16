import { Client, CommandInteraction, GuildMember, Role, } from 'discord.js';

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
    leave_msg?: null | string,
    created_at?: null | string
}

export type MuteOptions = {
    member: GuildMember,
    mutedRole: Role,
    interaction: CommandInteraction
    reason?: string,
    duration?: string
}