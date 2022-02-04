import { Message, Client, MessageAttachment } from 'discord.js';
import { ownerID } from '../config.js';
import { guildHandler } from '../index.js';
import sleep from '../util/sleep.js';


export default {
    name: "messageCreate",
    once: false,
    execute: async (message: Message, client: Client) => {
        const { channel, author, content } = message;
        if (author.id === client.user.id) return;

        if (channel.type === "DM") {
            client.users.fetch(author.id).then(user => user.send(`${content} | **Sent by: ${user.tag}**`));
        }

    }

}