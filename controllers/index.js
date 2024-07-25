import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { uploadFileToS3, getFileFromS3 } from '../model/s3.js';
import { Database } from '../dbconfig.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const showIndexView = (req, res) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
};


export const uploadPost = async (req, res) => {
  try {
    //console.log('req.body:', req.body);
    //console.log('req.file:', req.file);

    const textContent = req.body.text || null;
    let imageName = null;

    if (req.file) {
      const data = await uploadFileToS3(req.file);
      imageName = data.key;

      if (data.$metadata.httpStatusCode !== 200) {
        return res.status(500).json({ 'message': 'Image upload failed', 'details': data });
      }
    }

    // 檢查是否有內容可以插入資料庫
    if (!textContent && !imageName) {
      return res.status(400).json({ 'message': 'No text or image provided' });
    }
    
    
    // 無論有無圖片都存儲文字和圖片URL
    const query = 'INSERT INTO post (message, image_name) VALUES (?, ?)';
    const params = [textContent, imageName];
    await Database.executeQuery(query, params);
    res.status(200).json({ 'message':'Upload and database insert successful' });

  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
};


export const getPost = async (req, res) => {
  try {
    const query = 'SELECT * FROM post ORDER BY id DESC';
    const posts = await Database.executeQuery(query);
    await getFileFromS3(posts);
    console.log(posts);
    res.status(200).json({ data: posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).send('Error fetching posts');
  }
};