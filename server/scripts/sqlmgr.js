const _mysql = require("./mysql")
const {db_config} = require('../config/config.js')

class SQLMgr {
    constructor() {
        this.mysql = new _mysql()
        this.mysql.connect(db_config.host,db_config.id,db_config.pw,db_config.database)
    }

    async login(id, pw) {
        return await this.mysql.querySelectOne(`
            SELECT *
            FROM user
            WHERE userId = ?
                AND pw = ?
        `, [id, pw])
    }
}

module.exports = new SQLMgr()