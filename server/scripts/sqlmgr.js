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
            WHERE id = ?
        `,[id])
    }
    
    async getTemplatesByCategoryId(id){
        return await this.mysql.query(`
            SELECT * 
            FROM template
            WHERE category_id = ? 
                AND isMain = 0
        `,[id])
    }

    async getPhotobookByUserId(userId){
        return await this.mysql.query(`
            SELECT *
            FROM user_photobook
            WHERE userId = ?
        `,[userId])
    }

    async getPhotobookById(id){
        return await this.mysql.query(`
            SELECT *
            FROM user_photobook
            WHERE id = ?
        `,[id])
    }

    async newPhotobookPath(path){
        return await this.mysql.query(`
            INSERT INTO user_photobook(path)
            VALUES (?)
        `,[path])
    }
    
    async updatePhotobook(id,name,templateCategoryId,userId){
        return await this.mysql.query(`
            UPDATE user_photobook
            SET name = ?, templateCategoryId = ?, userId = ?
            WHERE id = ?
        `,[name,templateCategoryId,userId,id])
    }
}

module.exports = new SQLMgr()