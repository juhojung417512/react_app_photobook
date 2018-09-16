import express from 'express';
import post from './post';
import get from './get'

const router = express.Router();
router.use('/get',get)
router.use('/post', post);

export default router;