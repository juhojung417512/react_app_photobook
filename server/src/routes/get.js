import express from 'express';
import mysql from '../../scripts/sqlmgr'
const router = express.Router();

router.get('/',(req,res)=>{
    return res.json({
        success: true
    })
})

router.get('/photos',async (req,res)=>{
    let photo_list = await mysql.getPhotos()
    let list = []
    for(var p of photo_list){
        list.push({id : p.id, src: p.src, size: {width: p.width, height: p.height}})
    }
    return res.json({
        photoList : list
    })
})

router.get('/stickers',async (req,res)=>{
    let sticker_list = await mysql.getStickers()
    let list = []
    for(var s of sticker_list){
        list.push({id : s.id, src: s.src, size: {width: s.width, height: s.height}})
    }
    return res.json({
        stickerList : list.length === 0 ? null : list
    })
})

router.get('/templates',async (req,res)=>{
    let template_list = await mysql.getTemplates()
    return res.json({
        templateList : template_list.length === 0 ? null : template_list
    })
})

router.get('/template/:id',async (req,res)=>{
    let template = await mysql.getTemplateById(req.params.id)
    return res.json({
        template : template
    })
})

export default router;