const _ = require('mysql2');
const mysql = require('mysql2/promise');

class MySQL {
    constructor() {}

    async connect(host, id, pass, database) {
        this.pool = mysql.createPool({
            host: host,
            user: id,
            password: pass,
            database: database,
            charset: "utf8_general_ci",
        });
    }

    async query(sql, args) {
        //console.log("query : ",this.format(sql,args))
        try{
            let [rows] = await this.pool.query(sql, args);
            return rows
        } catch(err){
            console.log(err,sql,args)
        }
        return null
    }

    async querySelectOne(sql, args) {
        let rows = await this.query(sql,args)
        return rows == null ? null : rows[0]
    }

    format(sql, args) {
        return _.format(sql, args)
    }
}

module.exports = MySQL;