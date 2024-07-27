import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"; 
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();


const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

// 打印環境變量以檢查是否正確加載（.env要在根目錄才讀得到）
//console.log('Bucket Name:', bucketName);
//console.log('Bucket Region:', bucketRegion);
//console.log('Access Key:', accessKey);
//console.log('Secret Access Key:', secretAccessKey);

// 初始化 S3 客戶端
const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  }
});


const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');



// 上傳文件到 S3 (file傳入的是req.file)
export const uploadFileToS3 = async (file) => {
  //調整圖片大小
  //const buffer = await sharp(file.buffer).resize({height:null, width:200,fit:'contain'}).toBuffer();
  const buffer = await resizeImage(file.buffer);

  const key = randomImageName();
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  const uploadResult = await s3.send(command);

  return { ...uploadResult, key };
};

export const getFileFromS3 = async (posts) => {
  for (const post of posts){
    const getObjectParams = {
      Bucket: bucketName,
      Key: post.image_name,
    }
    const command = new GetObjectCommand(getObjectParams)
    //const url = await getSignedUrl(s3, command, { expiresIn: 3600 })
    post.image_url = 'https://d3q4cpn0fxi6na.cloudfront.net/' + post.image_name;
    
  }
}


