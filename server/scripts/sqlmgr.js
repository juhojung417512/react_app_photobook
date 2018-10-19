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

    async getPhotos(){
        return await this.mysql.query(`
            SELECT *
            FROM photo
        `)
    }

    async getStickers(){
        return await this.mysql.query(`
            SELECT * 
            FROM sticker
        `)
    }

    async getTemplates(){
        return await this.mysql.query(`
            SELECT *
            FROM template
        `)
    }

    async getTemplateById(id){
        return await this.mysql.querySelectOne(`
            SELECT *
            FROM template
            WHERE templateId = ?
        `,[id])
    }
}

module.exports = new SQLMgr()