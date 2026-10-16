import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (fileBuffer, folder = 'sweet_whisk') => {
  // If Cloudinary credentials are provided, upload to Cloudinary
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  // Fallback: save to local disk
  const uploadDir = path.resolve('uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, fileBuffer);

  return `/uploads/${fileName}`;
};

export default cloudinary;
