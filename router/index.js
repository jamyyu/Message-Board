//const path = require('path')
import express from 'express';
import { showIndexView, upload, uploadPost, getPost } from '../controllers/index.js';

const router = express.Router();

router.get('/', showIndexView);
router.post('/api/posts', upload.single('image'), uploadPost);
router.get('/api/posts', getPost);

export default router;