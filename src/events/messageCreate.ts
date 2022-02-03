import { Message, Client, MessageAttachment } from 'discord.js';
import { ownerID } from '../config.js';
import { database } from '../index.js';

export default {
    name: "messageCreate",
    once: false,
    execute: (message: Message, client: Client) => {
        const {channel, author, content } = message;
        if (author.id === client.user.id) return;

        if (channel.type === "DM") {
            client.users.fetch(ownerID).then(user => user.send(`${content} | **Sent by: ${user.tag}**`));
        }

        //bad words
        //bad links 



        // const file = new MessageAttachment('../../furiaclient.png');

        // if (content.startsWith("!send")) { 

        //     channel.send({
        //         embeds: [rulesEmbed]
        //     })

        //     channel.send({
        //         embeds: [mainInfoEmbed]
        //     })

        // }

    }

}