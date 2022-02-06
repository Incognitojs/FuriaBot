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


    //TODO: work on this!!* 
    updateSpecificGuildContent(guildID: string) {
        db.database.query(
            "USE discord; SELECT * from guilds WHERE guildID = ?",
            [guildID],
            (err, results) => {

            //    console.log(results[1],"res")

                if (err) throw new Error(err.message);

                //this.guildContents.filter(item => item.guildID = results[1].guildID)


                // for (let i = this.guildContents.length - 1; i >= 0; --i) {
                //     if (this.guildContents[i].guildID === guildID) {
                //         this.guildContents.splice(i,1)
                //     }
                // }

                const newContents = this.guildContents.filter((item) => {

                    //console.log(item.guildID, "item");
                    // console.log("---------------------------------------------------")
                    console.log(results[1][0].guildID, "result")

                    return item => item.guildID !== results[1].guildID
                });

              //  console.log("new contents", this.guildContents , "new contents");

           //     this.guildContents = [...newContents, results[1]]

            //    console.log(this.guildContents, "guild contents")
                return 
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
            err => err && console.error(err.message)
        )

        this.updateSpecificGuildContent(guildID);

    }


}