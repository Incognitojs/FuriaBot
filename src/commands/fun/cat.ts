import { CommandInteraction, ColorResolvable } from "discord.js";
import { en_text, colors } from '../../config.js';
import fetch from 'node-fetch'
import type { guild } from '../../../index';

export default {
    data: en_text.command.cat.data,
    run: async (interaction: CommandInteraction, guild: guild) => {
        const _data = await fetch('https://api.thecatapi.com/v1/images/search');
        const data: any = await _data.json();

        const randomColor = colors.colors[Math.floor(Math.random() * colors.colors.length)];
        const hex = randomColor[Object.keys(randomColor)[0]] as ColorResolvable;
   

        interaction.reply({
            embeds: [{
                description: "",
                color: hex,
                image: {
                    url: `${data[0].url}`
                }
            }]
        })
    }
}