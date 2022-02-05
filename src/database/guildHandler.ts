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
            () => this.getAllGuildContent()
        )
    }

    updateWelcomeMessageId(guildID: string, channelID: string | boolean) {
        if (!channelID)
            db.database.query(
                "USE discord; UPDATE guilds SET welcome_c_id = ? WHERE guildID = ?",
                [null, guildID],
                err => err && console.error(err)
            )

        db.database.query(
            "USE discord; UPDATE guilds SET welcome_c_id = ? WHERE guildID = ?",
            [channelID, guildID],
            err => err && console.error(err)
        )
    }


}