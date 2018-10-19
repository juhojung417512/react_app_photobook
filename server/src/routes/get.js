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
    return res.json({
        photoList : photo_list.length === 0 ? null : photo_list
    })
})

router.get('/stickers',async (req,res)=>{
    let sticker_list = await mysql.getStickers()
    return res.json({
        stickerList : sticker_list.length === 0 ? null : sticker_list
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