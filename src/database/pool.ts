import { createPool, Pool, PoolConfig } from 'mysql';
import chalk from 'chalk';

export default class Database {
    private _state = "connect";
    public database: Pool;
    public databaseOptions: PoolConfig

    constructor(private options: PoolConfig) {
        this.state = "connect"
    };

    set state(state: typeof Database.prototype._state) {
        switch (state) {
            case "connect":
                this.database = createPool(this.options)
                this.database.getConnection(e => {
                    if (e) throw new Error(e.message);
                    console.info(
                            chalk.green(`Database connection established.`,
                            chalk.blue(`[USER]:`),
                            chalk.cyan(`${this.options.user}`),
                            chalk.blue(`[HOST]:`),
                            chalk.cyan(`${this.options.host}`))
                    )
                });
        }
    }
}