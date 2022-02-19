import { createPool, Pool, PoolConfig } from 'mysql';
import { logger }                       from '../../index.js';

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
                    logger.databaseConnected(this.options.user, this.options.host)
                });
        }
    }
}
