import express from 'express';
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

export default router;