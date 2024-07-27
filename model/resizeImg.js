import Jimp from 'jimp';

export const resizeImage = async(fileBuffer) => {
  try {
    const image = await Jimp.read(fileBuffer);
    const buffer = await image
      .resize(200, Jimp.AUTO) // 調整寬度到 200，保持比例
      .getBufferAsync(Jimp.AUTO); // 轉換為 PNG 格式的緩衝區
    return buffer;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}