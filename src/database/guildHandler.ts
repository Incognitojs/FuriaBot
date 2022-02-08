import { monthYear } from '../util/time.js';
import { db } from '../index.js';

export default class GuildHandler {
    public guildContents: any[];

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

    insertGuild(guildID: string, guildName: string, ownerName: string) {
        db.database.query(
            "USE discord; INSERT INTO guilds (guildID, guildName, ownerName, created_at) VALUES (?,?,?,?)",
            [guildID, guildName, ownerName, monthYear()],
            err => err ? console.error(err.message) : this.getAllGuildContent()
        )
    }

    updateWelcomeMessageId(guildID: string, channelID: string | boolean) {
        db.database.query(
            "USE discord; UPDATE guilds SET welcome_c_id = ? WHERE guildID = ?",
            [channelID === false ? null : channelID, guildID],
            err => {
                if (err) throw new Error(err.message)
                return  this.updateSpecificGuildContent(guildID);
            }

           
        )
    }


}