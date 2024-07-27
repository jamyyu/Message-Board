import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const gm = require('gm').subClass({ imageMagick: true });

export const resizeImage = async function (fileBuffer) {
  return new Promise((resolve, reject) => {
    gm(fileBuffer)
      .resize(200, null)  
      .toBuffer((err, buffer) => {  
        if (err) return reject(err);
        resolve(buffer);
      });
  });
}