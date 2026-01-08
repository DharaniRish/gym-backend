import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Memory storage for multer
const storage = multer.memoryStorage();

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// Helper function to upload to Cloudinary
export const uploadToCloudinary = (buffer, folder = 'gymverse') => {
  return new Promise((resolve, reject) => {
    // Convert buffer to base64 data URI
    const base64 = buffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;
    cloudinary.uploader.upload(dataUri, {
      folder: folder,
      resource_type: 'image',
    }, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};

export default cloudinary;

