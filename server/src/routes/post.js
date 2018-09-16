import express from 'express';
import multer from 'multer'
import mysql from '../../scripts/sqlmgr'
import fs from "fs"
import path from "path"

const router = express.Router();
const storage = multer({ dest: '../../photos', limits: { fileSize: 5 * 1024 * 1024 } }) 
const upload = storage.single('file');

let filename
router.post("/upload/file",upload,(req,res)=>{
    let img_id = Math.floor(Math.random() * 10000).toString() + req.file.originalname ;
    fs.rename(req.file.path, 'photos/'+ img_id ,(err)=>{
        if(err){
            console.log(err)
            filename = null
        }
    })
    filename = 'photos/'+ img_id
    return res.json({filename: filename})
})

router.post('/login', async (req, res) => {
    console.log('reading post ', req.body);
    let data = req.body[0]
    if(data.id == undefined || data.pw == undefined)
        return res.json({
            result: false
        })
    let result = await mysql.login(data.id,data.pw)
    return res.json({
        result : result !== undefined && result.userId !== undefined ? true : false,
        id: data.id,
        pw: data.pw
    });
});


export default router;