import express from 'express';
import multer from 'multer'
import mysql from '../../scripts/sqlmgr'
import fs from "fs"
import path from "path"

const router = express.Router();
const storage = multer({ dest: '../../photos', limits: { fileSize: 5 * 1024 * 1024 } }) 
const upload = storage.single('file');

let filename
router.post("/upload/image",upload,(req,res)=>{
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

router.post("/photobook/save",(req,res)=>{
    let data = req.body[0].data
    let id = req.body[0].id
    // update photobook by id
    console.log(data)
    return true
})

router.post("/upload/photobook",(req,res)=>{
    let imageData = req
    return true
})

router.post('/login', async (req, res) => {
    let data = req.body[0]
    if(data.id == undefined || data.pw == undefined)
        return res.json({
            result: false
        })
    let result = await mysql.login(data.id,data.pw)
    return res.json({
        result : result !== null && result.userId !== undefined ? true : false,
    });
});

router.post('/photobook/path', async(req,res)=>{
    // let result = await mysql.newPhotobookPath(req.body[0].path)
    let result = {
        insertId : 1
    }
    return res.json({
        res : result !== null ? true : false,
        path : req.body[0].path,
        id : result !== null ? result.insertId : null
    })
})

router.post('/photobook/new', async (req,res)=>{
    // new photobook
    let data = req.body[0]
    let templateCategoryId = req.body[0].templateCategoryId;
    let result = await mysql.getTemplatesByCategoryId(templateCategoryId);
    await mysql.updatePhotobook(data.id,data.name,templateCategoryId,data.userId)
    // new photobook row
    
    return res.json({
        res : result
    })
})


export default router;