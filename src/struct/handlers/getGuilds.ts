import { db } from '../../index.js';
import type { guild } from '../../../index'

// export default () => {

//     let contents: Array<guild>;

//     db.query(
//         "USE discord; SELECT * FROM guilds",
//         (error, results) => {
//             if (error) throw new Error(error.message)
//             contents = results[1];
//         }
//     )

//     console.log(contents);
//     return contents;
// }


export default function(this) { 

    new Promise(resolve => {
        db.query("USE discord; SELECT * FROM guilds", (err, results) => {
            if (err) throw new Error(err.message);
            this.guildContents = results[1];
            resolve(results[1]);
        })
    })
}
//      new Promise(resolve => {
//     db.query("USE discord; SELECT * FROM guilds", (error, results) => {
//         if (error) throw new Error(error.message);
//         resolve(results[1]);
//     })
// })