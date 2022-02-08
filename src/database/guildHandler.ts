import { monthYear } from '../util/time.js';
import { db } from '../index.js';
import type { guild } from '../../index';

export default class GuildHandler {
    public guildContents: Array<guild>;

    /**
     * Getting every guild stored in database
     * then pushing the contents to a single array (guildContents)
     * then we use guildContents as a sort of cache for the guilds the bot is in.
     */
    getAllGuildContent() {
        db.database.query(
            "USE discord; SELECT * FROM guilds",
            (error, results) => {
                if (error) throw new Error(error.message);
                this.guildContents = results[1];
                return;
            }
        )
    }


    /**
     * Updating a specific guild's contents in the guildContents array.
     * usually after we update a value in a row we will call this function
     * to have the most up to date data in our cache (this.guildContents)
    */
    updateSpecificGuildContent(guildID: string) {
        db.database.query(
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
     * Checking if a specified guild exists
     * within the database.
     */
    guildExistsInDatabase(guildID: string) {
        return new Promise(resolve =>
            db.database.query(
                'USE discord; SELECT * FROM guilds WHERE guildID = ?',
                [guildID],
                (error, results) => {
                    if (error) throw new Error(error.message);
                    if (results[1].length === 0) resolve(false);
                    resolve(true);
                }
            ))
    }


    /**
     * Inserting a new guild into the database
     * when the bot is invited to a new guild.
     */
    insertGuild(guildID: string, guildName: string, ownerName: string) {
        db.database.query(
            "USE discord; INSERT INTO guilds (guildID, guildName, ownerName, created_at) VALUES (?,?,?,?)",
            [guildID, guildName, ownerName, monthYear()],
            err => err ? console.error(err.message) : this.getAllGuildContent()
        )
    }


    /**
     * Setting the welcome message channel ID, this function is 
     * called when a admin enables welcome / leave messages within
     * their discord server.
     */
    updateWelcomeMessageId(guildID: string, channelID: string | boolean) {
        db.database.query(
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
        db.database.query(
            `USE discord; UPDATE guilds SET ${row} = ? WHERE guildID = ?`,
            [message, guildID],
            err => err ? console.error(err.message) : this.updateSpecificGuildContent(guildID)
        )
    }
}