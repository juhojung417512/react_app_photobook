import express from 'express';
import multer from 'multer'
import mysql from '../../scripts/sqlmgr'
import fs from "fs"
import path from "path"
import imagick from 'imagemagick'
const router = express.Router();
const storage = multer({ dest: '../../photos', limits: { fileSize: 5 * 1024 * 1024 } }) 
const upload = storage.single('file');

let filename
router.post("/upload/file",upload,(req,res)=>{
    let size = null
    let img_id = 'resources/' + Math.floor(Math.random() * 10000).toString() + req.file.originalname ;
    filename = img_id
    fs.rename(req.file.path, img_id ,(err)=>{
        if(err){
            console.log(err)
            filename = null
        }
    })
    // image size return
    // console.log(path.join(__dirname, '../../', img_id))
    // imagick.identify(path.join(__dirname, '../../', img_id), function(err, features){
    //     if (err) throw err
    //     console.log("SEX")
        
    //     console.log(features)
    // })
    return res.json({src: filename, size : {width : 300, height : 300}})
})

router.post("/upload/photobook",(req,res)=>{
    let imageData = req
    console.log(imageData)
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