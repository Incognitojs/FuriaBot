import { db } from '../../index.js';

export default (guildId: string) => new Promise(resolve => {
    console.log(guildId)
    db.query(
        "USE discord; SELECT * FROM guilds WHERE guildID = ?",
        [guildId], (err, results) => {
            if (err) throw new Error(err.message);
            if (results[1].length > 0) resolve(true)
            else resolve(false);
        }
    )
})