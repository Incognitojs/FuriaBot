import { monthYear } from '../util/time.js';
import { db } from '../index.js';
import { getUnmuteTime } from '../util/convertTime.js';

import type { GuildMember, Role, Permissions } from 'discord.js';
import type FuriaBot from './client.js';
import type { guild, MuteOptions } from '../../index';

import getGuilds from './handlers/getGuilds.js';
import guildExists from './handlers/guildExists.js';

export default class GuildHandler {
    public guildContents: Array<guild>;

    constructor(public client: FuriaBot) { };



        /**
         * Getting all guilds that are stored in the database then
         * pushing the contents to the guildContents array.
         */
        public getAllGuildContent = () => {

        }


        /**
         * Checking if the guild exists in the database
         * @returns boolean
         */
        public guildExistsInDatabase = async (guildId: string) => 
            await guildExists(guildId);


        /**
         * Updating a specific guild's contents in the guildContents array.
         * usually after we update a value in a row we will call this function
         * to have the most up to date data in our cache (this.guildContents)
        */
        updateSpecificGuildContent(guildID: string) {
            db.query(
                "USE discord; SELECT * from guilds WHERE guildID = ?",
                [guildID],
                (err, results) => {
                    if (err) throw new Error(err.message);
                    const newArray = this.guildContents.filter(item => item.guildID !== results[1][0].guildID);
                    return this.guildContents = [...newArray, results[1][0]];
                }
            )
        }




        /**
         * Inserting a new guild into the database
         * when the bot is invited to a new guild.
         */
        insertGuild(guildID: string, guildName: string, ownerName: string) {
            db.query(
                "USE discord; INSERT INTO guilds (guildID, guildName, ownerName, created_at) VALUES (?,?,?,?)",
                [guildID, guildName, ownerName, monthYear()],
                // err => err ? console.error(err.message) : this.getAllGuildContent()
            )
        }


        /**
         * Setting the welcome message channel ID, this function is 
         * called when a admin enables welcome / leave messages within
         * their discord server.
         */
        updateWelcomeMessageId(guildID: string, channelID: string | boolean) {
            db.query(
                "USE discord; UPDATE guilds SET welcome_c_id = ? WHERE guildID = ?",
                [channelID === false ? null : channelID, guildID],
                err => {
                    if (err) throw new Error(err.message)
                    return this.updateSpecificGuildContent(guildID);
                }
            )
        }


        /**
         * Updating the welcome_msg row in the database,
         * this is called when an admin sets their own custom
         * welcome or leave message within their server.
         */
        updateWelcomeMessage(guildID: string, message: string, type: string) {
            const row: string = type === "welcome" ? "welcome_msg" : "leave_msg";
            db.query(
                `USE discord; UPDATE guilds SET ${row} = ? WHERE guildID = ?`,
                [message, guildID],
                err => err ? console.error(err.message) : this.updateSpecificGuildContent(guildID)
            )
        }


        /**
         * Handling errors.
         */
        handleError(error, interaction) {
            const reply = (text: string) => interaction.reply({ content: text, ephemeral: true })

            switch (error.message) {
                case "Missing Access":
                    return reply("I do not have permission to mute")
                case "convert_time":
                    return reply("The duration specified was not in the correct format.")
                case "HASMUTEDROLE":
                    return reply("This user is already muted.")
            }
        }

        /**
         * Muting a user
        */
        muteUser(options: MuteOptions) {
            let { member, mutedRole, interaction, reason, duration } = options;
            return new Promise(async (resolve, reject) => {
                if (member.roles.cache.find(role => role.name === "muted"))
                    return reject(this.handleError({ message: "HASMUTEDROLE" }, interaction));

                try {
                    await member.roles.add(mutedRole);
                    await member.send(`> <:error:940632365921873980> You have been **muted** in the guild **${member.guild.name}** ${reason ? `\`reason:\` ${reason}.` : ""} ${duration ? `\`duration:\` ${duration}` : ""}`)
                }
                catch (error) {
                    return reject(this.handleError(error, interaction));
                }

                db.query(
                    "USE discord; INSERT IGNORE into muted (guildID, mutedID, reason, duration), VALUES(?,?,?,?)",
                    [member.guild.id, member.id, reason, Math.floor(Date.now() / 1000 + await getUnmuteTime(duration))]
                )

                resolve(true);
            })
        }


        /**
         * Kicking a user.
         */
        kickUser(reason: string | undefined, guildName: string, guildIconUrl: string, user: GuildMember) {
            return new Promise(async resolve => {
                await user.send(`> <:error:940632365921873980> You have been **Kicked** from the guild **${guildName}** ${reason ? `\`reason:\` ${reason}` : ""}`).catch(() => null)
                await user.kick().catch(() => resolve(false));
                resolve(true)
            })
        }

        /**
         * Banning a user.
         */
        banUser(
            user: GuildMember,
            duration: number,
            bannedBy: string,
            reason: string,
            durationString: string,
            guildName: string,
            banIsPermanent: boolean
        ) {
            return new Promise(async resolve => {
                if (!user.bannable) return resolve(false);
                await user.send(`> <:error:940632365921873980> You have been ${banIsPermanent ? "**Permanently**" : ""} **Banned** from the guild **${guildName}** ${reason ? `\`reason:\` ${reason}.` : ""} ${!banIsPermanent ? `\`Duration\`: ${durationString}` : ""}`)
                await user.ban().catch(() => resolve(false));
                db.query(
                    "USE discord; INSERT IGNORE INTO banned (guildID,guildName,bannedID,userBanned,bannedBy,reason,duration) VALUES(?,?,?,?,?,?,?)",
                    [user.guild.id, user.guild.name, user.user.id, user.user.tag, bannedBy, reason, duration],
                    err => {
                        if (err) {
                            console.error(err);
                            resolve(false);
                        }
                        resolve(true);
                    }
                )
            })
        }


        /**
         * Handle check ban time,
         * this will run on an interval.
         */
        handleBanTimeCheck() {
            db.query(
                "USE discord; SELECT guildID, bannedID, userBanned, guildName, duration FROM banned",
                async (err, results) => {
                    if (err) throw new Error(err.message);
                    for (const user_row of results[1]) {
                        if (Date.now() / 1000 < user_row.duration || results[1].length === 0) return;
                        try {
                            const guild = await this.client.guilds.fetch(user_row.guildID);
                            await guild.members.unban(user_row.bannedID);

                            db.query(
                                "USE discord; DELETE FROM banned WHERE guildID = ? AND bannedID = ?",
                                [user_row.guildID, user_row.bannedID]
                            )
                        }
                        catch { }
                    }
                }
            )
        }


    }