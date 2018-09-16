import express from 'express';
import mysql from '../../scripts/sqlmgr'

const router = express.Router();

router.get('/',(req,res)=>{
    return res.json({
        success: true
    })
})

router.get('/:id', (req, res) => {
    console.log('reading post ', req.params.id);
    return res.json({
        index: req.params.id
    });
});

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